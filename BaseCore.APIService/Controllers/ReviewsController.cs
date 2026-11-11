using BaseCore.Entities;
using BaseCore.Repository.EFCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BaseCore.APIService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewRepositoryEF _reviewRepository;
        private readonly IProductRepositoryEF _productRepository;

        public ReviewsController(
            IReviewRepositoryEF reviewRepository,
            IProductRepositoryEF productRepository)
        {
            _reviewRepository = reviewRepository;
            _productRepository = productRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reviews = await _reviewRepository.GetAllAsync();
            return Ok(reviews.OrderByDescending(r => r.CreatedAt));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var review = await _reviewRepository.GetByIdAsync(id);
            if (review == null)
                return NotFound(new { message = "Review not found" });

            return Ok(review);
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetByProduct(int productId, [FromQuery] bool onlyApproved = true)
        {
            var reviews = await _reviewRepository.GetByProductIdAsync(productId, onlyApproved);
            return Ok(reviews);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(string userId)
        {
            var reviews = await _reviewRepository.GetByUserIdAsync(userId);
            return Ok(reviews);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] ReviewCreateDto dto)
        {
            if (dto.Rating < 1 || dto.Rating > 5)
                return BadRequest(new { message = "Rating must be between 1 and 5" });

            var product = await _productRepository.GetByIdAsync(dto.ProductId);
            if (product == null)
                return BadRequest(new { message = "Product not found" });

            var review = new Review
            {
                ProductId = dto.ProductId,
                UserId = dto.UserId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                IsApproved = false,
                CreatedAt = DateTime.Now
            };

            await _reviewRepository.AddAsync(review);
            return CreatedAtAction(nameof(GetById), new { id = review.Id }, review);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] ReviewUpdateDto dto)
        {
            var review = await _reviewRepository.GetByIdAsync(id);
            if (review == null)
                return NotFound(new { message = "Review not found" });

            if (dto.Rating.HasValue && (dto.Rating.Value < 1 || dto.Rating.Value > 5))
                return BadRequest(new { message = "Rating must be between 1 and 5" });

            review.Rating = dto.Rating ?? review.Rating;
            review.Comment = dto.Comment ?? review.Comment;
            review.IsApproved = dto.IsApproved ?? review.IsApproved;

            await _reviewRepository.UpdateAsync(review);
            return Ok(review);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var review = await _reviewRepository.GetByIdAsync(id);
            if (review == null)
                return NotFound(new { message = "Review not found" });

            await _reviewRepository.DeleteAsync(review);
            return Ok(new { message = "Review deleted successfully" });
        }
    }

    public class ReviewCreateDto
    {
        public int ProductId { get; set; }
        public string UserId { get; set; } = "";
        public int Rating { get; set; } = 5;
        public string? Comment { get; set; }
    }

    public class ReviewUpdateDto
    {
        public int? Rating { get; set; }
        public string? Comment { get; set; }
        public bool? IsApproved { get; set; }
    }
}