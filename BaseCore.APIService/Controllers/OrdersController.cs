using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BaseCore.Entities;
using BaseCore.Repository.EFCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BaseCore.APIService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepositoryEF _orderRepository;
        private readonly IOrderDetailRepositoryEF _orderDetailRepository;
        private readonly IProductRepositoryEF _productRepository;
        private readonly IProductVariantRepositoryEF _variantRepository;
        private readonly ICartRepositoryEF _cartRepository;

        private static readonly HashSet<string> ValidStatuses = new(StringComparer.OrdinalIgnoreCase)
        {
            OrderStatus.Pending,
            OrderStatus.Processing,
            OrderStatus.Shipped,
            OrderStatus.Delivered,
            OrderStatus.Cancelled
        };

        public OrdersController(
            IOrderRepositoryEF orderRepository,
            IOrderDetailRepositoryEF orderDetailRepository,
            IProductRepositoryEF productRepository,
            IProductVariantRepositoryEF variantRepository,
            ICartRepositoryEF cartRepository)
        {
            _orderRepository = orderRepository;
            _orderDetailRepository = orderDetailRepository;
            _productRepository = productRepository;
            _variantRepository = variantRepository;
            _cartRepository = cartRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                         ?? User.FindFirst("id")?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Không xác định được danh tính người dùng." });

            var orders = await _orderRepository.GetByUserAsync(userId);
            return Ok(orders);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderRepository.GetAllAsync();
            return Ok(orders);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _orderRepository.GetWithDetailsAsync(id);
            if (order == null)
                return NotFound(new { message = "Đơn hàng không tồn tại." });

            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                                ?? User.FindFirst("id")?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && order.UserId != currentUserId)
                return Forbid();

            return Ok(order);
        }

        /// <summary>
        /// Tạo đơn hàng - Kiểm tra & trừ tồn kho theo Biến thể (Variant)
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                         ?? User.FindFirst("id")?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Vui lòng đăng nhập để đặt hàng." });

            if (dto.Items == null || !dto.Items.Any())
                return BadRequest(new { message = "Đơn hàng phải có ít nhất 1 sản phẩm." });

            decimal totalAmount = 0;
            var orderDetails = new List<OrderDetail>();

            foreach (var item in dto.Items)
            {
                // 1. Kiểm tra biến thể có tồn tại không
                var variant = await _variantRepository.GetByIdAsync(item.VariantId);
                if (variant == null)
                    return BadRequest(new { message = $"Biến thể ID {item.VariantId} không tồn tại." });

                // 2. Kiểm tra tồn kho của biến thể
                if (variant.Stock < item.Quantity)
                    return BadRequest(new { message = $"Biến thể '{variant.Color} - {variant.Size}' không đủ tồn kho (Còn lại: {variant.Stock})." });

                var product = await _productRepository.GetByIdAsync(variant.ProductId);
                if (product == null)
                    return BadRequest(new { message = $"Sản phẩm liên kết không tồn tại." });

                // Ưu tiên giá riêng của biến thể, nếu không có lấy giá sản phẩm gốc
                decimal unitPrice = variant.Price ?? product.Price;
                totalAmount += unitPrice * item.Quantity;

                orderDetails.Add(new OrderDetail
                {
                    ProductId = product.Id,
                    VariantId = variant.Id,
                    Quantity = item.Quantity,
                    UnitPrice = unitPrice
                });

                // 3. Trừ tồn kho biến thể và sản phẩm cha
                variant.Stock -= item.Quantity;
                product.Stock = Math.Max(0, product.Stock - item.Quantity);

                await _variantRepository.UpdateAsync(variant);
                await _productRepository.UpdateAsync(product);
            }

            // 4. Tạo Order
            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                TotalAmount = totalAmount,
                Status = OrderStatus.Pending,
                ShippingAddress = dto.ShippingAddress ?? ""
            };

            await _orderRepository.AddAsync(order);

            // 5. Lưu OrderDetails
            foreach (var detail in orderDetails)
            {
                detail.OrderId = order.Id;
                await _orderDetailRepository.AddAsync(detail);
            }

            // 6. Đóng giỏ hàng Active
            await _cartRepository.CloseCartAsPaidAsync(userId, order.Id);

            return CreatedAtAction(nameof(GetById), new { id = order.Id }, new { order, details = orderDetails });
        }

        [HttpPut("{id:int}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Status) || !ValidStatuses.Contains(dto.Status))
            {
                return BadRequest(new
                {
                    message = $"Trạng thái không hợp lệ. Các trạng thái cho phép: {string.Join(", ", ValidStatuses)}"
                });
            }

            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null)
                return NotFound(new { message = "Đơn hàng không tồn tại." });

            order.Status = dto.Status;
            await _orderRepository.UpdateAsync(order);

            return Ok(order);
        }

        /// <summary>
        /// Hủy đơn hàng và hoàn lại tồn kho cho từng biến thể
        /// </summary>
        [HttpPut("{id:int}/cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null)
                return NotFound(new { message = "Đơn hàng không tồn tại." });

            if (order.Status == OrderStatus.Delivered)
                return BadRequest(new { message = "Đơn hàng đã giao thành công, không thể hủy." });

            if (order.Status == OrderStatus.Cancelled)
                return BadRequest(new { message = "Đơn hàng đã bị hủy trước đó." });

            // Hoàn tồn kho về đúng biến thể
            var details = await _orderDetailRepository.GetByOrderAsync(id);
            foreach (var detail in details)
            {
                var variant = await _variantRepository.GetByIdAsync(detail.VariantId);
                if (variant != null)
                {
                    variant.Stock += detail.Quantity;
                    await _variantRepository.UpdateAsync(variant);
                }

                var product = await _productRepository.GetByIdAsync(detail.ProductId);
                if (product != null)
                {
                    product.Stock += detail.Quantity;
                    await _productRepository.UpdateAsync(product);
                }
            }

            order.Status = OrderStatus.Cancelled;
            await _orderRepository.UpdateAsync(order);

            return Ok(new { message = "Đã hủy đơn hàng và hoàn lại tồn kho.", order });
        }
    }

    public class CreateOrderDto
    {
        public List<OrderItemDto> Items { get; set; } = new();
        public string? ShippingAddress { get; set; }
    }

    public class OrderItemDto
    {
        public int VariantId { get; set; } // ID biến thể (kèm size/màu)
        public int Quantity { get; set; }
    }

    public class UpdateStatusDto
    {
        public string Status { get; set; } = "";
    }
}