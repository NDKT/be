using BaseCore.Entities;
using BaseCore.Repository.EFCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Services
{
    public interface ICartItemService
    {
        Task<List<CartItem>> GetAllAsync();
        Task<CartItem?> GetByIdAsync(int id);
        Task<List<CartItem>> GetByCartIdAsync(int cartId);
        Task<CartItem> AddOrUpdateItemAsync(int cartId, int variantId, int quantity);
        Task UpdateAsync(CartItem item);
        Task DeleteAsync(int id);
        Task ClearCartAsync(int cartId);
    }

    public class CartItemService : ICartItemService
    {
        private readonly ICartItemRepositoryEF _repository;

        public CartItemService(ICartItemRepositoryEF repository)
        {
            _repository = repository;
        }

        public async Task<List<CartItem>> GetAllAsync()
        {
            var items = await _repository.GetAllAsync();
            return items.ToList();
        }

        public async Task<CartItem?> GetByIdAsync(int id) => await _repository.GetByIdAsync(id);

        public async Task<List<CartItem>> GetByCartIdAsync(int cartId) => await _repository.GetByCartIdAsync(cartId);

        public async Task<CartItem> AddOrUpdateItemAsync(int cartId, int variantId, int quantity)
        {
            var existing = await _repository.GetByCartAndVariantAsync(cartId, variantId);
            if (existing != null)
            {
                existing.Quantity += quantity;
                await _repository.UpdateAsync(existing);
                return existing;
            }

            var newItem = new CartItem
            {
                CartId = cartId,
                VariantId = variantId,
                Quantity = quantity,
                AddedAt = DateTime.Now
            };
            return await _repository.AddAsync(newItem);
        }

        public async Task UpdateAsync(CartItem item) => await _repository.UpdateAsync(item);

        public async Task DeleteAsync(int id) => await _repository.DeleteByIdAsync(id);

        public async Task ClearCartAsync(int cartId) => await _repository.ClearCartAsync(cartId);
    }
}
