using BaseCore.Entities;
using BaseCore.Repository.EFCore;
using Microsoft.AspNetCore.Mvc;

namespace BaseCore.APIService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartItemsController : ControllerBase
    {
        private readonly ICartItemRepositoryEF _cartItemRepository;
        private readonly ICartRepositoryEF _cartRepository;
        private readonly IProductVariantRepositoryEF _variantRepository;

        public CartItemsController(
            ICartItemRepositoryEF cartItemRepository,
            ICartRepositoryEF cartRepository,
            IProductVariantRepositoryEF variantRepository)
        {
            _cartItemRepository = cartItemRepository;
            _cartRepository = cartRepository;
            _variantRepository = variantRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _cartItemRepository.GetAllAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _cartItemRepository.GetByIdAsync(id);
            if (item == null)
                return NotFound(new { message = "CartItem not found" });

            return Ok(item);
        }

        [HttpGet("cart/{cartId}")]
        public async Task<IActionResult> GetByCart(int cartId)
        {
            var items = await _cartItemRepository.GetByCartIdAsync(cartId);
            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CartItemCreateDto dto)
        {
            var cart = await _cartRepository.GetByIdAsync(dto.CartId);
            if (cart == null)
                return BadRequest(new { message = "Cart not found" });

            var variant = await _variantRepository.GetByIdAsync(dto.VariantId);
            if (variant == null)
                return BadRequest(new { message = "ProductVariant not found" });

            var existing = await _cartItemRepository.GetByCartAndVariantAsync(dto.CartId, dto.VariantId);
            if (existing != null)
            {
                existing.Quantity += dto.Quantity;
                await _cartItemRepository.UpdateAsync(existing);
                return Ok(existing);
            }

            var item = new CartItem
            {
                CartId = dto.CartId,
                VariantId = dto.VariantId,
                Quantity = dto.Quantity,
                AddedAt = DateTime.Now
            };

            await _cartItemRepository.AddAsync(item);
            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CartItemUpdateDto dto)
        {
            var item = await _cartItemRepository.GetByIdAsync(id);
            if (item == null)
                return NotFound(new { message = "CartItem not found" });

            if (dto.Quantity.HasValue && dto.Quantity.Value <= 0)
            {
                await _cartItemRepository.DeleteAsync(item);
                return Ok(new { message = "CartItem removed as quantity <= 0" });
            }

            item.VariantId = dto.VariantId ?? item.VariantId;
            item.Quantity = dto.Quantity ?? item.Quantity;

            await _cartItemRepository.UpdateAsync(item);
            return Ok(item);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _cartItemRepository.GetByIdAsync(id);
            if (item == null)
                return NotFound(new { message = "CartItem not found" });

            await _cartItemRepository.DeleteAsync(item);
            return Ok(new { message = "CartItem deleted successfully" });
        }

        [HttpDelete("cart/{cartId}/clear")]
        public async Task<IActionResult> ClearCart(int cartId)
        {
            await _cartItemRepository.ClearCartAsync(cartId);
            return Ok(new { message = "Cart cleared successfully" });
        }
    }

    public class CartItemCreateDto
    {
        public int CartId { get; set; }
        public int VariantId { get; set; }
        public int Quantity { get; set; } = 1;
    }

    public class CartItemUpdateDto
    {
        public int? VariantId { get; set; }
        public int? Quantity { get; set; }
    }
}