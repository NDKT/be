using BaseCore.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Repository.EFCore
{
    public interface ICategory2RepositoryEF : IRepository<Category2>
    {
        Task<Category2?> GetByNameAsync(string name);
    }

    public class Category2RepositoryEF : Repository<Category2>, ICategory2RepositoryEF
    {
        public Category2RepositoryEF(MySqlDbContext context) : base(context)
        {
        }

        public async Task<Category2?> GetByNameAsync(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.Name.ToLower() == name.ToLower());
        }
    }
}
