using BaseCore.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Repository.EFCore
{
    public interface IShippingAddressRepositoryEF : IRepository<ShippingAddress>
    {
        Task<List<ShippingAddress>> GetByUserIdAsync(string userId);
        Task<ShippingAddress?> GetDefaultByUserIdAsync(string userId);
        Task UnsetDefaultForUserAsync(string userId);
    }

    public class ShippingAddressRepositoryEF : Repository<ShippingAddress>, IShippingAddressRepositoryEF
    {
        public ShippingAddressRepositoryEF(MySqlDbContext context) : base(context)
        {
        }

        public async Task<List<ShippingAddress>> GetByUserIdAsync(string userId)
        {
            return await _dbSet
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.IsDefault)
                .ThenByDescending(a => a.Id)
                .ToListAsync();
        }

        public async Task<ShippingAddress?> GetDefaultByUserIdAsync(string userId)
        {
            return await _dbSet
                .FirstOrDefaultAsync(a => a.UserId == userId && a.IsDefault);
        }

        public async Task UnsetDefaultForUserAsync(string userId)
        {
            var defaults = await _dbSet
                .Where(a => a.UserId == userId && a.IsDefault)
                .ToListAsync();

            if (defaults.Any())
            {
                foreach (var addr in defaults)
                {
                    addr.IsDefault = false;
                }
                _dbSet.UpdateRange(defaults);
                await _context.SaveChangesAsync();
            }
        }
    }
}
