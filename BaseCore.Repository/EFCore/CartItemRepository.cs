using BaseCore.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Repository.EFCore
{
    public interface ICartItemRepositoryEF : IRepository<CartItem>
    {
        Task<List<CartItem>> GetByCartIdAsync(int cartId);
        Task<CartItem?> GetByCartAndVariantAsync(int cartId, int variantId);
        Task ClearCartAsync(int cartId);
    }

    public class CartItemRepositoryEF : Repository<CartItem>, ICartItemRepositoryEF
    {
        public CartItemRepositoryEF(MySqlDbContext context) : base(context)
        {
        }

        public async Task<List<CartItem>> GetByCartIdAsync(int cartId)
        {
            return await _dbSet
                .Where(ci => ci.CartId == cartId)
                .Include(ci => ci.Variant)
                    .ThenInclude(v => v!.Product)
                .ToListAsync();
        }

        public async Task<CartItem?> GetByCartAndVariantAsync(int cartId, int variantId)
        {
            return await _dbSet
                .FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.VariantId == variantId);
        }

        public async Task ClearCartAsync(int cartId)
        {
            var items = await _dbSet.Where(ci => ci.CartId == cartId).ToListAsync();
            if (items.Any())
            {
                _dbSet.RemoveRange(items);
                await _context.SaveChangesAsync();
            }
        }
    }
}
