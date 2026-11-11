using Microsoft.EntityFrameworkCore;
using BaseCore.Entities;
using System;
using System.Threading.Tasks;

namespace BaseCore.Repository.EFCore
{
    public interface ICartRepositoryEF : IRepository<Cart>
    {
        Task<Cart?> GetActiveCartByUserIdAsync(string userId);
        Task<Cart> GetOrCreateActiveCartAsync(string userId);
        Task<Cart?> GetCartWithItemsAsync(int cartId);
        Task<bool> CloseCartAsPaidAsync(string userId, int orderId);
    }

    public class CartRepositoryEF : Repository<Cart>, ICartRepositoryEF
    {
        public CartRepositoryEF(MySqlDbContext context) : base(context)
        {
        }

        /// <summary>
        /// Lấy giỏ hàng đang Active của user kèm toàn bộ sản phẩm bên trong
        /// </summary>
        public async Task<Cart?> GetActiveCartByUserIdAsync(string userId)
        {
            return await _dbSet
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Variant)
                        .ThenInclude(v => v!.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId && c.Status == CartStatus.Active);
        }

        /// <summary>
        /// Lấy giỏ Active, nếu chưa có thì tự động tạo mới giỏ Active
        /// </summary>
        public async Task<Cart> GetOrCreateActiveCartAsync(string userId)
        {
            var cart = await GetActiveCartByUserIdAsync(userId);
            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    Status = CartStatus.Active,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await _dbSet.AddAsync(cart);
                await _context.SaveChangesAsync();
            }
            return cart;
        }

        public async Task<Cart?> GetCartWithItemsAsync(int cartId)
        {
            return await _dbSet
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Variant)
                        .ThenInclude(v => v!.Product)
                .Include(c => c.Order)
                .FirstOrDefaultAsync(c => c.Id == cartId);
        }

        /// <summary>
        /// Đóng giỏ khi thanh toán xong: Status -> 'Paid', PaidAt -> Now, OrderId -> orderId
        /// </summary>
        public async Task<bool> CloseCartAsPaidAsync(string userId, int orderId)
        {
            var cart = await _dbSet.FirstOrDefaultAsync(c => c.UserId == userId && c.Status == CartStatus.Active);
            if (cart == null) return false;

            cart.Status = CartStatus.Paid;
            cart.PaidAt = DateTime.UtcNow;
            cart.UpdatedAt = DateTime.UtcNow;
            cart.OrderId = orderId;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}