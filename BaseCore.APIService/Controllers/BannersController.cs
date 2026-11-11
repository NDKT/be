using BaseCore.Entities;
using BaseCore.Repository.EFCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BaseCore.APIService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannersController : ControllerBase
    {
        private readonly IBannerRepositoryEF _bannerRepository;

        public BannersController(IBannerRepositoryEF bannerRepository)
        {
            _bannerRepository = bannerRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var banners = await _bannerRepository.GetAllAsync();
            return Ok(banners.OrderBy(b => b.SortOrder));
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActive()
        {
            var banners = await _bannerRepository.GetActiveBannersAsync();
            return Ok(banners);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var banner = await _bannerRepository.GetByIdAsync(id);
            if (banner == null)
                return NotFound(new { message = "Banner not found" });

            return Ok(banner);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] BannerCreateDto dto)
        {
            var banner = new Banner
            {
                Title = dto.Title,
                ImageUrl = dto.ImageUrl,
                LinkUrl = dto.LinkUrl,
                SortOrder = dto.SortOrder,
                IsActive = dto.IsActive
            };

            await _bannerRepository.AddAsync(banner);
            return CreatedAtAction(nameof(GetById), new { id = banner.Id }, banner);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] BannerUpdateDto dto)
        {
            var banner = await _bannerRepository.GetByIdAsync(id);
            if (banner == null)
                return NotFound(new { message = "Banner not found" });

            banner.Title = dto.Title ?? banner.Title;
            banner.ImageUrl = dto.ImageUrl ?? banner.ImageUrl;
            banner.LinkUrl = dto.LinkUrl ?? banner.LinkUrl;
            banner.SortOrder = dto.SortOrder ?? banner.SortOrder;
            banner.IsActive = dto.IsActive ?? banner.IsActive;

            await _bannerRepository.UpdateAsync(banner);
            return Ok(banner);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var banner = await _bannerRepository.GetByIdAsync(id);
            if (banner == null)
                return NotFound(new { message = "Banner not found" });

            await _bannerRepository.DeleteAsync(banner);
            return Ok(new { message = "Banner deleted successfully" });
        }
    }

    public class BannerCreateDto
    {
        public string? Title { get; set; }
        public string ImageUrl { get; set; } = "";
        public string? LinkUrl { get; set; }
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    public class BannerUpdateDto
    {
        public string? Title { get; set; }
        public string? ImageUrl { get; set; }
        public string? LinkUrl { get; set; }
        public int? SortOrder { get; set; }
        public bool? IsActive { get; set; }
    }
}