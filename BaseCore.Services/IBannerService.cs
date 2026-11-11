using BaseCore.Entities;
using BaseCore.Repository.EFCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Services
{
    public interface IBannerService
    {
        Task<List<Banner>> GetAllAsync();
        Task<List<Banner>> GetActiveBannersAsync();
        Task<Banner?> GetByIdAsync(int id);
        Task<Banner> CreateAsync(Banner banner);
        Task UpdateAsync(Banner banner);
        Task DeleteAsync(int id);
    }

    public class BannerService : IBannerService
    {
        private readonly IBannerRepositoryEF _repository;

        public BannerService(IBannerRepositoryEF repository)
        {
            _repository = repository;
        }

        public async Task<List<Banner>> GetAllAsync()
        {
            var items = await _repository.GetAllAsync();
            return items.OrderBy(b => b.SortOrder).ToList();
        }

        public async Task<List<Banner>> GetActiveBannersAsync() => await _repository.GetActiveBannersAsync();

        public async Task<Banner?> GetByIdAsync(int id) => await _repository.GetByIdAsync(id);

        public async Task<Banner> CreateAsync(Banner banner) => await _repository.AddAsync(banner);

        public async Task UpdateAsync(Banner banner) => await _repository.UpdateAsync(banner);

        public async Task DeleteAsync(int id) => await _repository.DeleteByIdAsync(id);
    }
}