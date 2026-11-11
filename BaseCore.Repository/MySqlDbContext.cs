using Microsoft.EntityFrameworkCore;
using BaseCore.Entities;

namespace BaseCore.Repository
{
    /// <summary>
    /// Entity Framework Core DbContext for MySQL
    /// Used for teaching EF Core concepts (Bài 10)
    /// </summary>
    public class MySqlDbContext : DbContext
    {
        public MySqlDbContext(DbContextOptions<MySqlDbContext> options) : base(options)
        {
        }

        // DbSet for each entity
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Category2> Category2s { get; set; }
        public DbSet<Product2> Product2s { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Banner> Banners { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<ShippingAddress> ShippingAddresses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(36).IsRequired().ValueGeneratedNever();
                entity.Property(e => e.UserName).HasMaxLength(50).IsRequired();
                entity.Property(e => e.Password).HasMaxLength(255).IsRequired();
                entity.Property(e => e.Name).HasMaxLength(100);
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.Phone).HasMaxLength(20);
                entity.HasIndex(e => e.UserName).IsUnique();

                entity.HasIndex(e => e.Email)
                  .IsUnique()
                  .HasFilter("[Email] IS NOT NULL")
                  .HasDatabaseName("IX_Users_Email");
            });

            // Configure Category entity
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Description).HasMaxLength(500);
            });

            modelBuilder.Entity<Category2>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Description).HasMaxLength(500);
            });

            // Configure Product entity
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
                entity.Property(e => e.Price).HasPrecision(18, 2);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.ImageUrl).HasMaxLength(500);

                // Relationship with Category
                entity.HasOne(e => e.Category)
                      .WithMany()
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            //Configure product2 entity
            modelBuilder.Entity<Product2>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
                entity.Property(e => e.Price).HasPrecision(18, 2);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.ImageUrl).HasMaxLength(500);

                // Relationship with Category
                entity.HasOne(e => e.Category)
                      .WithMany()
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Order entity
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);

                // 1. Sửa UserId: NVARCHAR(36), NOT NULL, có Index
                entity.Property(e => e.UserId)
                      .HasMaxLength(36)
                      .IsRequired();

                entity.HasIndex(e => e.UserId)
                      .HasDatabaseName("IX_Orders_UserId");

                // 2. Sửa Status: NVARCHAR(30), NOT NULL, Default 'Pending', có Index
                entity.Property(e => e.Status)
                      .HasMaxLength(30)
                      .HasDefaultValue(OrderStatus.Pending)
                      .IsRequired();

                entity.HasIndex(e => e.Status)
                      .HasDatabaseName("IX_Orders_Status");

                // 3. Ràng buộc CHECK Status
                entity.ToTable(t => t.HasCheckConstraint(
                    "CK_Orders_Status",
                    "[Status] IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')"));

                entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
                entity.Property(e => e.ShippingAddress).HasMaxLength(500);

                // 4. Thiết lập quan hệ Khóa ngoại Orders(UserId) -> Users(Id)
                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict); // Giữ lại đơn hàng để đối soát, không xóa cascade theo user
            });

            // Configure OrderDetail entity
            modelBuilder.Entity<OrderDetail>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
                entity.Property(e => e.Quantity).IsRequired();

                // Cấu hình VariantId và Index
                entity.Property(e => e.VariantId).IsRequired();
                entity.HasIndex(e => e.VariantId).HasDatabaseName("IX_OrderDetails_VariantId");

                // Relationships
                entity.HasOne(e => e.Order)
                      .WithMany(o => o.OrderDetails)
                      .HasForeignKey(e => e.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Product)
                      .WithMany()
                      .HasForeignKey(e => e.ProductId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Khóa ngoại liên kết tới ProductVariants
                entity.HasOne(e => e.Variant)
                      .WithMany()
                      .HasForeignKey(e => e.VariantId)
                      .OnDelete(DeleteBehavior.Restrict);
            });



            //add them
            modelBuilder.Entity<ProductVariant>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Size).HasMaxLength(20).IsRequired();
                entity.Property(e => e.Color).HasMaxLength(50).IsRequired();
                entity.Property(e => e.Stock).HasDefaultValue(0).IsRequired();
                entity.Property(e => e.Price).HasPrecision(18, 2);
                entity.Property(e => e.SKU).HasMaxLength(50);
                entity.Property(e => e.ImageUrl).HasMaxLength(500);

                // Thêm .HasFilter để cho phép nhiều dòng có SKU = NULL
                entity.HasIndex(e => e.SKU)
                      .IsUnique()
                      .HasFilter("[SKU] IS NOT NULL");

                entity.HasOne(e => e.Product)
                      .WithMany()
                      .HasForeignKey(e => e.ProductId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ProductImage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ImageUrl).HasMaxLength(500).IsRequired();
                entity.Property(e => e.IsMain).HasDefaultValue(false);
                entity.Property(e => e.SortOrder).HasDefaultValue(0);

                entity.HasOne(e => e.Product)
                      .WithMany()
                      .HasForeignKey(e => e.ProductId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Cart>(entity =>
            {
                entity.HasKey(e => e.Id);

                // 1. UserId NOT NULL
                entity.Property(e => e.UserId)
                      .HasMaxLength(36)
                      .IsRequired();

                // 3. Status NOT NULL, Default 'Active'
                entity.Property(e => e.Status)
                      .HasMaxLength(20)
                      .HasDefaultValue(CartStatus.Active)
                      .IsRequired();

                // 4. PaidAt datetime2(7)
                entity.Property(e => e.PaidAt)
                      .HasColumnType("datetime2(7)");

                // 7. CreatedAt & UpdatedAt datetime2(7)
                entity.Property(e => e.CreatedAt)
                      .HasColumnType("datetime2(7)")
                      .HasDefaultValueSql("SYSUTCDATETIME()");

                entity.Property(e => e.UpdatedAt)
                      .HasColumnType("datetime2(7)")
                      .HasDefaultValueSql("SYSUTCDATETIME()");

                // 6. CHECK Status IN ('Active', 'Paid', 'Abandoned')
                entity.ToTable(t => t.HasCheckConstraint("CK_Carts_Status", "[Status] IN ('Active', 'Paid', 'Abandoned')"));

                // 2. Unique Filtered Index: Mỗi User chỉ có đúng 1 giỏ 'Active'
                entity.HasIndex(e => e.UserId)
                      .IsUnique()
                      .HasFilter("[Status] = 'Active'")
                      .HasDatabaseName("IX_Carts_UserId_Active");

                // 8. Index tra cứu (UserId, Status) và (OrderId)
                entity.HasIndex(e => new { e.UserId, e.Status })
                      .HasDatabaseName("IX_Carts_UserId_Status");

                entity.HasIndex(e => e.OrderId)
                      .HasDatabaseName("IX_Carts_OrderId");

                // Relationships
                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                // 5. Liên kết OrderId -> Orders(Id)
                entity.HasOne(e => e.Order)
                      .WithMany()
                      .HasForeignKey(e => e.OrderId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Quantity).IsRequired();

                // RÀNG BUỘC UNIQUE: Mỗi VariantId chỉ được xuất hiện tối đa 1 lần trong 1 CartId
                entity.HasIndex(e => new { e.CartId, e.VariantId })
                      .IsUnique()
                      .HasDatabaseName("IX_CartItems_CartId_VariantId");

                // Khóa ngoại liên kết tới Cart
                entity.HasOne(e => e.Cart)
                      .WithMany(c => c.CartItems)
                      .HasForeignKey(e => e.CartId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Khóa ngoại liên kết tới ProductVariant
                entity.HasOne(e => e.Variant)
                      .WithMany()
                      .HasForeignKey(e => e.VariantId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

           
            modelBuilder.Entity<Banner>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).HasMaxLength(200);
                entity.Property(e => e.ImageUrl).HasMaxLength(500).IsRequired();
                entity.Property(e => e.LinkUrl).HasMaxLength(500);
                entity.Property(e => e.SortOrder).HasDefaultValue(0);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
            });

            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UserId).HasMaxLength(36).IsRequired();
                entity.Property(e => e.IsApproved).HasDefaultValue(false);
                entity.ToTable(t => t.HasCheckConstraint("CK_Reviews_Rating", "[Rating] >= 1 AND [Rating] <= 5"));

                entity.HasOne(e => e.Product)
                      .WithMany()
                      .HasForeignKey(e => e.ProductId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ShippingAddress>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UserId).HasMaxLength(36).IsRequired();
                entity.Property(e => e.ReceiverName).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Phone).HasMaxLength(20).IsRequired();
                entity.Property(e => e.Province).HasMaxLength(100).IsRequired();
                entity.Property(e => e.District).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Ward).HasMaxLength(100).IsRequired();
                entity.Property(e => e.DetailAddress).HasMaxLength(500).IsRequired();
                entity.Property(e => e.IsDefault).HasDefaultValue(false);

                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Seed initial data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Electronics", Description = "Electronic devices and gadgets" },
                new Category { Id = 2, Name = "Clothing", Description = "Apparel and fashion items" },
                new Category { Id = 3, Name = "Books", Description = "Books and publications" },
                new Category { Id = 4, Name = "Home & Garden", Description = "Home and garden products" },
                new Category { Id = 5, Name = "Sports", Description = "Sports equipment and accessories" }
            );

            // Seed Products
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Name = "Laptop Dell XPS 15", Price = 35000000, Stock = 10, CategoryId = 1, Description = "High-performance laptop", ImageUrl = "" },
                new Product { Id = 2, Name = "iPhone 15 Pro", Price = 28000000, Stock = 15, CategoryId = 1, Description = "Latest Apple smartphone", ImageUrl = "" },
                new Product { Id = 3, Name = "T-Shirt Cotton", Price = 250000, Stock = 100, CategoryId = 2, Description = "Comfortable cotton t-shirt", ImageUrl = "" },
                new Product { Id = 4, Name = "Programming Book", Price = 450000, Stock = 50, CategoryId = 3, Description = "Learn programming basics", ImageUrl = "" },
                new Product { Id = 5, Name = "Garden Tools Set", Price = 850000, Stock = 25, CategoryId = 4, Description = "Complete gardening toolkit", ImageUrl = "" }
            );

            // Seed admin user (password: admin123, hash computed with fixed salt for demo)
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = "00000000-0000-0000-0000-000000000001",
                UserName = "admin",
                Password = "Y9E5Rowpc1Ie/rZyqI4ZEZgK0GUaIFYw0/BnkoFRUdE=",
                Salt = new byte[] { 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160 },
                Name = "Administrator",
                Email = "admin@robotvibot.com",
                Phone = "0123456789",
                Position = "System Administrator",
                Contact = "",
                Image = "",
                IsActive = true,
                UserType = 1,
                Created = new DateTime(2026, 1, 1)
            });
        }
    }
}
