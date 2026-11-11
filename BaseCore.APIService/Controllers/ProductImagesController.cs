using BaseCore.Entities;
using BaseCore.Repository.EFCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BaseCore.APIService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductImagesController : ControllerBase
    {
        private readonly IProductImageRepositoryEF _imageRepository;
        private readonly IProductRepositoryEF _productRepository;

        public ProductImagesController(
            IProductImageRepositoryEF imageRepository,
            IProductRepositoryEF productRepository)
        {
            _imageRepository = imageRepository;
            _productRepository = productRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var images = await _imageRepository.GetAllAsync();
            return Ok(images);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var image = await _imageRepository.GetByIdAsync(id);
            if (image == null)
                return NotFound(new { message = "ProductImage not found" });

            return Ok(image);
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetByProduct(int productId)
        {
            var images = await _imageRepository.GetByProductIdAsync(productId);
            return Ok(images);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] ProductImageCreateDto dto)
        {
            var product = await _productRepository.GetByIdAsync(dto.ProductId);
            if (product == null)
                return BadRequest(new { message = "Product not found" });

            var image = new ProductImage
            {
                ProductId = dto.ProductId,
                ImageUrl = dto.ImageUrl,
                IsMain = dto.IsMain,
                SortOrder = dto.SortOrder
            };

            await _imageRepository.AddAsync(image);
            return CreatedAtAction(nameof(GetById), new { id = image.Id }, image);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] ProductImageUpdateDto dto)
        {
            var image = await _imageRepository.GetByIdAsync(id);
            if (image == null)
                return NotFound(new { message = "ProductImage not found" });

            image.ProductId = dto.ProductId ?? image.ProductId;
            image.ImageUrl = dto.ImageUrl ?? image.ImageUrl;
            image.IsMain = dto.IsMain ?? image.IsMain;
            image.SortOrder = dto.SortOrder ?? image.SortOrder;

            await _imageRepository.UpdateAsync(image);
            return Ok(image);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var image = await _imageRepository.GetByIdAsync(id);
            if (image == null)
                return NotFound(new { message = "ProductImage not found" });

            await _imageRepository.DeleteAsync(image);
            return Ok(new { message = "ProductImage deleted successfully" });
        }
    }

    public class ProductImageCreateDto
    {
        public int ProductId { get; set; }
        public string ImageUrl { get; set; } = "";
        public bool IsMain { get; set; } = false;
        public int SortOrder { get; set; } = 0;
    }

    public class ProductImageUpdateDto
    {
        public int? ProductId { get; set; }
        public string? ImageUrl { get; set; }
        public bool? IsMain { get; set; }
        public int? SortOrder { get; set; }
    }
}