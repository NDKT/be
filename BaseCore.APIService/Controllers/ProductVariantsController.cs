using BaseCore.Entities;
using BaseCore.Repository.EFCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BaseCore.APIService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductVariantsController : ControllerBase
    {
        private readonly IProductVariantRepositoryEF _variantRepository;
        private readonly IProductRepositoryEF _productRepository;

        public ProductVariantsController(
            IProductVariantRepositoryEF variantRepository,
            IProductRepositoryEF productRepository)
        {
            _variantRepository = variantRepository;
            _productRepository = productRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var (items, totalCount) = await _variantRepository.GetPagedAsync(page, pageSize, null, v => v.Id, true);
            return Ok(new
            {
                items,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var variant = await _variantRepository.GetByIdAsync(id);
            if (variant == null)
                return NotFound(new { message = "ProductVariant not found" });

            return Ok(variant);
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetByProduct(int productId)
        {
            var variants = await _variantRepository.GetByProductIdAsync(productId);
            return Ok(variants);
        }

        [HttpGet("sku/{sku}")]
        public async Task<IActionResult> GetBySku(string sku)
        {
            var variant = await _variantRepository.GetBySkuAsync(sku);
            if (variant == null)
                return NotFound(new { message = "ProductVariant not found" });

            return Ok(variant);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] ProductVariantCreateDto dto)
        {
            var product = await _productRepository.GetByIdAsync(dto.ProductId);
            if (product == null)
                return BadRequest(new { message = "Product not found" });

            if (!string.IsNullOrEmpty(dto.SKU))
            {
                var existingSku = await _variantRepository.GetBySkuAsync(dto.SKU);
                if (existingSku != null)
                    return BadRequest(new { message = "SKU already exists" });
            }

            var variant = new ProductVariant
            {
                ProductId = dto.ProductId,
                Size = dto.Size,
                Color = dto.Color,
                Stock = dto.Stock,
                Price = dto.Price,
                SKU = dto.SKU,
                ImageUrl = dto.ImageUrl
            };

            await _variantRepository.AddAsync(variant);
            return CreatedAtAction(nameof(GetById), new { id = variant.Id }, variant);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] ProductVariantUpdateDto dto)
        {
            var variant = await _variantRepository.GetByIdAsync(id);
            if (variant == null)
                return NotFound(new { message = "ProductVariant not found" });

            if (dto.ProductId.HasValue)
            {
                var product = await _productRepository.GetByIdAsync(dto.ProductId.Value);
                if (product == null)
                    return BadRequest(new { message = "Product not found" });
                variant.ProductId = dto.ProductId.Value;
            }

            variant.Size = dto.Size ?? variant.Size;
            variant.Color = dto.Color ?? variant.Color;
            variant.Stock = dto.Stock ?? variant.Stock;
            variant.Price = dto.Price ?? variant.Price;
            variant.SKU = dto.SKU ?? variant.SKU;
            variant.ImageUrl = dto.ImageUrl ?? variant.ImageUrl;

            await _variantRepository.UpdateAsync(variant);
            return Ok(variant);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var variant = await _variantRepository.GetByIdAsync(id);
            if (variant == null)
                return NotFound(new { message = "ProductVariant not found" });

            await _variantRepository.DeleteAsync(variant);
            return Ok(new { message = "ProductVariant deleted successfully" });
        }
    }

    public class ProductVariantCreateDto
    {
        public int ProductId { get; set; }
        public string Size { get; set; } = "";
        public string Color { get; set; } = "";
        public int Stock { get; set; } = 0;
        public decimal? Price { get; set; }
        public string? SKU { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class ProductVariantUpdateDto
    {
        public int? ProductId { get; set; }
        public string? Size { get; set; }
        public string? Color { get; set; }
        public int? Stock { get; set; }
        public decimal? Price { get; set; }
        public string? SKU { get; set; }
        public string? ImageUrl { get; set; }
    }
}