using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace BaseCore.Repository
{
    /// <summary>
    /// Design-time factory: đảm bảo `dotnet ef migrations add` luôn dùng MySQL,
    /// không cần chỉ định --startup-project.
    /// </summary>
    public class MySqlDbContextFactory : IDesignTimeDbContextFactory<MySqlDbContext>
    {
        public MySqlDbContext CreateDbContext(string[] args)
        {
            var connectionString = "Data Source=.\\sqlexpress;Initial Catalog=BaseCoreSale2;Integrated Security=True;Trust Server Certificate=True";

            var optionsBuilder = new DbContextOptionsBuilder<MySqlDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new MySqlDbContext(optionsBuilder.Options);
        }
    }
}
