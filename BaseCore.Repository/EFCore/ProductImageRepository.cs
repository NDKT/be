using BaseCore.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Repository.EFCore
{
    public interface IProductImageRepositoryEF : IRepository<ProductImage>
    {
        Task<List<ProductImage>> GetByProductIdAsync(int productId);
        Task<ProductImage?> GetMainImageByProductIdAsync(int productId);
    }

    public class ProductImageRepositoryEF : Repository<ProductImage>, IProductImageRepositoryEF
    {
        public ProductImageRepositoryEF(MySqlDbContext context) : base(context)
        {
        }

        public async Task<List<ProductImage>> GetByProductIdAsync(int productId)
        {
            return await _dbSet
                .Where(i => i.ProductId == productId)
                .OrderByDescending(i => i.IsMain)
                .ThenBy(i => i.SortOrder)
                .ToListAsync();
        }

        public async Task<ProductImage?> GetMainImageByProductIdAsync(int productId)
        {
            return await _dbSet
                .Where(i => i.ProductId == productId && i.IsMain)
                .FirstOrDefaultAsync();
        }
    }
}
