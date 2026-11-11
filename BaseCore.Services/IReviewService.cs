using BaseCore.Entities;
using BaseCore.Repository.EFCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Services
{
    public interface IReviewService
    {
        Task<List<Review>> GetAllAsync();
        Task<Review?> GetByIdAsync(int id);
        Task<List<Review>> GetByProductIdAsync(int productId, bool onlyApproved = true);
        Task<List<Review>> GetByUserIdAsync(string userId);
        Task<Review> CreateAsync(Review review);
        Task UpdateAsync(Review review);
        Task<bool> ApproveAsync(int id, bool isApproved);
        Task DeleteAsync(int id);
    }

    public class ReviewService : IReviewService
    {
        private readonly IReviewRepositoryEF _repository;

        public ReviewService(IReviewRepositoryEF repository)
        {
            _repository = repository;
        }

        public async Task<List<Review>> GetAllAsync()
        {
            var items = await _repository.GetAllAsync();
            return items.OrderByDescending(r => r.CreatedAt).ToList();
        }

        public async Task<Review?> GetByIdAsync(int id) => await _repository.GetByIdAsync(id);

        public async Task<List<Review>> GetByProductIdAsync(int productId, bool onlyApproved = true)
            => await _repository.GetByProductIdAsync(productId, onlyApproved);

        public async Task<List<Review>> GetByUserIdAsync(string userId)
            => await _repository.GetByUserIdAsync(userId);

        public async Task<Review> CreateAsync(Review review)
        {
            review.CreatedAt = DateTime.Now;
            return await _repository.AddAsync(review);
        }

        public async Task UpdateAsync(Review review) => await _repository.UpdateAsync(review);

        public async Task<bool> ApproveAsync(int id, bool isApproved)
        {
            var review = await _repository.GetByIdAsync(id);
            if (review == null) return false;

            review.IsApproved = isApproved;
            await _repository.UpdateAsync(review);
            return true;
        }

        public async Task DeleteAsync(int id) => await _repository.DeleteByIdAsync(id);
    }
}