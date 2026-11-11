using BaseCore.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Repository.EFCore
{
    public interface IReviewRepositoryEF : IRepository<Review>
    {
        Task<List<Review>> GetByProductIdAsync(int productId, bool onlyApproved = true);
        Task<List<Review>> GetByUserIdAsync(string userId);
    }

    public class ReviewRepositoryEF : Repository<Review>, IReviewRepositoryEF
    {
        public ReviewRepositoryEF(MySqlDbContext context) : base(context)
        {
        }

        public async Task<List<Review>> GetByProductIdAsync(int productId, bool onlyApproved = true)
        {
            var query = _dbSet
                .Where(r => r.ProductId == productId)
                .Include(r => r.User)
                .AsQueryable();

            if (onlyApproved)
            {
                query = query.Where(r => r.IsApproved);
            }

            return await query
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Review>> GetByUserIdAsync(string userId)
        {
            return await _dbSet
                .Where(r => r.UserId == userId)
                .Include(r => r.Product)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }
    }
}
