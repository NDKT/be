using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Entities
{
    public static class CartStatus
    {
        public const string Active = "Active";
        public const string Paid = "Paid";
        public const string Abandoned = "Abandoned";
    }
    public class Cart
    {
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;

        public string Status { get; set; } = CartStatus.Active; // 3. Status ('Active', 'Paid', 'Abandoned')

        public DateTime? PaidAt { get; set; } // 4. Thời điểm thanh toán

        public int? OrderId { get; set; } // 5. Khóa ngoại liên kết Order

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow; // 7. Thời điểm cập nhật

        [BsonIgnore]
        public User? User { get; set; }

        [BsonIgnore]
        public Order? Order { get; set; }

        [BsonIgnore]
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
