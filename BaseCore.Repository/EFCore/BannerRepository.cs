using BaseCore.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Repository.EFCore
{
    public interface IBannerRepositoryEF : IRepository<Banner>
    {
        Task<List<Banner>> GetActiveBannersAsync();
    }

    public class BannerRepositoryEF : Repository<Banner>, IBannerRepositoryEF
    {
        public BannerRepositoryEF(MySqlDbContext context) : base(context)
        {
        }

        public async Task<List<Banner>> GetActiveBannersAsync()
        {
            return await _dbSet
                .Where(b => b.IsActive)
                .OrderBy(b => b.SortOrder)
                .ToListAsync();
        }
    }
}
