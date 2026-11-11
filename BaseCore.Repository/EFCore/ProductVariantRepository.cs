using BaseCore.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Repository.EFCore
{
    public interface IProductVariantRepositoryEF : IRepository<ProductVariant>
    {
        Task<List<ProductVariant>> GetByProductIdAsync(int productId);
        Task<ProductVariant?> GetBySkuAsync(string sku);
    }

    public class ProductVariantRepositoryEF : Repository<ProductVariant>, IProductVariantRepositoryEF
    {
        public ProductVariantRepositoryEF(MySqlDbContext context) : base(context)
        {
        }

        public async Task<List<ProductVariant>> GetByProductIdAsync(int productId)
        {
            return await _dbSet
                .Where(v => v.ProductId == productId)
                .Include(v => v.Product)
                .ToListAsync();
        }

        public async Task<ProductVariant?> GetBySkuAsync(string sku)
        {
            return await _dbSet
                .Include(v => v.Product)
                .FirstOrDefaultAsync(v => v.SKU == sku);
        }
    }
}