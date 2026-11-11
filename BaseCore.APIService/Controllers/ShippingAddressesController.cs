using BaseCore.Entities;
using BaseCore.Repository.EFCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BaseCore.APIService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShippingAddressesController : ControllerBase
    {
        private readonly IShippingAddressRepositoryEF _addressRepository;

        public ShippingAddressesController(IShippingAddressRepositoryEF addressRepository)
        {
            _addressRepository = addressRepository;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var addresses = await _addressRepository.GetAllAsync();
            return Ok(addresses);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var address = await _addressRepository.GetByIdAsync(id);
            if (address == null)
                return NotFound(new { message = "ShippingAddress not found" });

            return Ok(address);
        }

        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetByUser(string userId)
        {
            var addresses = await _addressRepository.GetByUserIdAsync(userId);
            return Ok(addresses);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] ShippingAddressCreateDto dto)
        {
            if (dto.IsDefault)
            {
                await _addressRepository.UnsetDefaultForUserAsync(dto.UserId);
            }

            var address = new ShippingAddress
            {
                UserId = dto.UserId,
                ReceiverName = dto.ReceiverName,
                Phone = dto.Phone,
                Province = dto.Province,
                District = dto.District,
                Ward = dto.Ward,
                DetailAddress = dto.DetailAddress,
                IsDefault = dto.IsDefault
            };

            await _addressRepository.AddAsync(address);
            return CreatedAtAction(nameof(GetById), new { id = address.Id }, address);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] ShippingAddressUpdateDto dto)
        {
            var address = await _addressRepository.GetByIdAsync(id);
            if (address == null)
                return NotFound(new { message = "ShippingAddress not found" });

            if (dto.IsDefault == true && !address.IsDefault)
            {
                await _addressRepository.UnsetDefaultForUserAsync(address.UserId);
            }

            address.ReceiverName = dto.ReceiverName ?? address.ReceiverName;
            address.Phone = dto.Phone ?? address.Phone;
            address.Province = dto.Province ?? address.Province;
            address.District = dto.District ?? address.District;
            address.Ward = dto.Ward ?? address.Ward;
            address.DetailAddress = dto.DetailAddress ?? address.DetailAddress;
            address.IsDefault = dto.IsDefault ?? address.IsDefault;

            await _addressRepository.UpdateAsync(address);
            return Ok(address);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var address = await _addressRepository.GetByIdAsync(id);
            if (address == null)
                return NotFound(new { message = "ShippingAddress not found" });

            await _addressRepository.DeleteAsync(address);
            return Ok(new { message = "ShippingAddress deleted successfully" });
        }
    }

    public class ShippingAddressCreateDto
    {
        public string UserId { get; set; } = "";
        public string ReceiverName { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Province { get; set; } = "";
        public string District { get; set; } = "";
        public string Ward { get; set; } = "";
        public string DetailAddress { get; set; } = "";
        public bool IsDefault { get; set; } = false;
    }

    public class ShippingAddressUpdateDto
    {
        public string? ReceiverName { get; set; }
        public string? Phone { get; set; }
        public string? Province { get; set; }
        public string? District { get; set; }
        public string? Ward { get; set; }
        public string? DetailAddress { get; set; }
        public bool? IsDefault { get; set; }
    }
}