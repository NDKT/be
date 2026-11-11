using Microsoft.EntityFrameworkCore;
using BaseCore.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BaseCore.Repository.EFCore
{
    public interface IOrderRepositoryEF : IRepository<Order>
    {
        Task<List<Order>> GetByUserAsync(string userId);
        Task<Order?> GetWithDetailsAsync(int orderId);
    }

    public class OrderRepositoryEF : Repository<Order>, IOrderRepositoryEF
    {
        public OrderRepositoryEF(MySqlDbContext context) : base(context)
        {
        }

        public async Task<List<Order>> GetByUserAsync(string userId)
        {
            return await _dbSet
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Variant) // Lấy Size, Color
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<Order?> GetWithDetailsAsync(int orderId)
        {
            return await _dbSet
                .Include(o => o.User)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Variant) // Lấy Size, Color
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }
    }

    public interface IOrderDetailRepositoryEF : IRepository<OrderDetail>
    {
        Task<List<OrderDetail>> GetByOrderAsync(int orderId);
    }

    public class OrderDetailRepositoryEF : Repository<OrderDetail>, IOrderDetailRepositoryEF
    {
        public OrderDetailRepositoryEF(MySqlDbContext context) : base(context)
        {
        }

        public async Task<List<OrderDetail>> GetByOrderAsync(int orderId)
        {
            return await _dbSet
                .Where(od => od.OrderId == orderId)
                .Include(od => od.Product)
                .Include(od => od.Variant) // Lấy Size, Color
                .ToListAsync();
        }
    }
}