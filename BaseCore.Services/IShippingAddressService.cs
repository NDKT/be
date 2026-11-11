using BaseCore.Entities;
using BaseCore.Repository.EFCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Services
{
    public interface IShippingAddressService
    {
        Task<List<ShippingAddress>> GetAllAsync();
        Task<ShippingAddress?> GetByIdAsync(int id);
        Task<List<ShippingAddress>> GetByUserIdAsync(string userId);
        Task<ShippingAddress?> GetDefaultByUserIdAsync(string userId);
        Task<ShippingAddress> CreateAsync(ShippingAddress address);
        Task UpdateAsync(ShippingAddress address);
        Task DeleteAsync(int id);
    }

    public class ShippingAddressService : IShippingAddressService
    {
        private readonly IShippingAddressRepositoryEF _repository;

        public ShippingAddressService(IShippingAddressRepositoryEF repository)
        {
            _repository = repository;
        }

        public async Task<List<ShippingAddress>> GetAllAsync()
        {
            var items = await _repository.GetAllAsync();
            return items.ToList();
        }

        public async Task<ShippingAddress?> GetByIdAsync(int id) => await _repository.GetByIdAsync(id);

        public async Task<List<ShippingAddress>> GetByUserIdAsync(string userId) => await _repository.GetByUserIdAsync(userId);

        public async Task<ShippingAddress?> GetDefaultByUserIdAsync(string userId) => await _repository.GetDefaultByUserIdAsync(userId);

        public async Task<ShippingAddress> CreateAsync(ShippingAddress address)
        {
            if (address.IsDefault)
            {
                await _repository.UnsetDefaultForUserAsync(address.UserId);
            }
            return await _repository.AddAsync(address);
        }

        public async Task UpdateAsync(ShippingAddress address)
        {
            if (address.IsDefault)
            {
                await _repository.UnsetDefaultForUserAsync(address.UserId);
            }
            await _repository.UpdateAsync(address);
        }

        public async Task DeleteAsync(int id) => await _repository.DeleteByIdAsync(id);
    }
}