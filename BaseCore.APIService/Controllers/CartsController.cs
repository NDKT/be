using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BaseCore.Entities;
using BaseCore.Repository.EFCore;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BaseCore.APIService.Controllers
{
    [Authorize] // Bắt buộc đăng nhập
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly ICartRepositoryEF _cartRepository;

        public CartsController(ICartRepositoryEF cartRepository)
        {
            _cartRepository = cartRepository;
        }

        /// <summary>
        /// Lấy giỏ hàng Active của user đang đăng nhập (tự động tạo mới nếu chưa có)
        /// </summary>
        [HttpGet("my-cart")]
        public async Task<IActionResult> GetMyCart()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                         ?? User.FindFirst("id")?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Không xác thực được danh tính người dùng." });

            var cart = await _cartRepository.GetOrCreateActiveCartAsync(userId);
            return Ok(cart);
        }

        /// <summary>
        /// Lấy thông tin chi tiết một giỏ hàng bất kỳ theo Id (kèm Order nếu đã thanh toán)
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cart = await _cartRepository.GetCartWithItemsAsync(id);
            if (cart == null)
                return NotFound(new { message = "Giỏ hàng không tồn tại." });

            return Ok(cart);
        }

        /// <summary>
        /// Đóng giỏ hàng sau khi thanh toán thành công: Chuyển sang 'Paid' và liên kết với OrderId
        /// </summary>
        [HttpPost("checkout-success")]
        public async Task<IActionResult> CheckoutSuccess([FromBody] CheckoutSuccessDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                         ?? User.FindFirst("id")?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Vui lòng đăng nhập." });

            var success = await _cartRepository.CloseCartAsPaidAsync(userId, dto.OrderId);
            if (!success)
                return BadRequest(new { message = "Không tìm thấy giỏ hàng Active để đóng." });

            // Sau khi đóng, user gọi lại /api/carts/my-cart sẽ tự động mở giỏ Active mới tinh
            return Ok(new
            {
                message = "Đã hoàn tất thanh toán và đóng giỏ hàng cũ.",
                orderId = dto.OrderId
            });
        }
    }

    public class CheckoutSuccessDto
    {
        public int OrderId { get; set; }
    }
}