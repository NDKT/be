using BaseCore.Entities;
using BaseCore.Repository.EFCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Services
{
    public interface IProductImageService
    {
        Task<List<ProductImage>> GetAllAsync();
        Task<ProductImage?> GetByIdAsync(int id);
        Task<List<ProductImage>> GetByProductIdAsync(int productId);
        Task<ProductImage> CreateAsync(ProductImage image);
        Task UpdateAsync(ProductImage image);
        Task DeleteAsync(int id);
    }

    public class ProductImageService : IProductImageService
    {
        private readonly IProductImageRepositoryEF _repository;

        public ProductImageService(IProductImageRepositoryEF repository)
        {
            _repository = repository;
        }

        public async Task<List<ProductImage>> GetAllAsync()
        {
            var items = await _repository.GetAllAsync();
            return items.ToList();
        }

        public async Task<ProductImage?> GetByIdAsync(int id) => await _repository.GetByIdAsync(id);

        public async Task<List<ProductImage>> GetByProductIdAsync(int productId) => await _repository.GetByProductIdAsync(productId);

        public async Task<ProductImage> CreateAsync(ProductImage image) => await _repository.AddAsync(image);

        public async Task UpdateAsync(ProductImage image) => await _repository.UpdateAsync(image);

        public async Task DeleteAsync(int id) => await _repository.DeleteByIdAsync(id);
    }
}
