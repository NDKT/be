using BaseCore.Entities;
using BaseCore.Repository.EFCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Services
{
    public interface IProductVariantService
    {
        Task<List<ProductVariant>> GetAllAsync();
        Task<ProductVariant?> GetByIdAsync(int id);
        Task<List<ProductVariant>> GetByProductIdAsync(int productId);
        Task<ProductVariant?> GetBySkuAsync(string sku);
        Task<ProductVariant> CreateAsync(ProductVariant variant);
        Task UpdateAsync(ProductVariant variant);
        Task DeleteAsync(int id);
    }

    public class ProductVariantService : IProductVariantService
    {
        private readonly IProductVariantRepositoryEF _repository;

        public ProductVariantService(IProductVariantRepositoryEF repository)
        {
            _repository = repository;
        }

        public async Task<List<ProductVariant>> GetAllAsync()
        {
            var items = await _repository.GetAllAsync();
            return items.ToList();
        }

        public async Task<ProductVariant?> GetByIdAsync(int id) => await _repository.GetByIdAsync(id);

        public async Task<List<ProductVariant>> GetByProductIdAsync(int productId) => await _repository.GetByProductIdAsync(productId);

        public async Task<ProductVariant?> GetBySkuAsync(string sku) => await _repository.GetBySkuAsync(sku);

        public async Task<ProductVariant> CreateAsync(ProductVariant variant) => await _repository.AddAsync(variant);

        public async Task UpdateAsync(ProductVariant variant) => await _repository.UpdateAsync(variant);

        public async Task DeleteAsync(int id) => await _repository.DeleteByIdAsync(id);
    }
}
