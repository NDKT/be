using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BaseCore.Entities
{
    public static class OrderStatus
    {
        public const string Pending = "Pending";
        public const string Processing = "Processing";
        public const string Shipped = "Shipped";
        public const string Delivered = "Delivered";
        public const string Cancelled = "Cancelled";
    }
    public class Order
    {
        [BsonId]
        public int Id { get; set; }


        [Required]
        [MaxLength(36)]
        public string UserId { get; set; } = string.Empty;

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        public decimal TotalAmount { get; set; }

        [Required]
        [MaxLength(30)]
        public string Status { get; set; } = OrderStatus.Pending;

        public string ShippingAddress { get; set; } =  string.Empty;

        [BsonIgnore]
        public virtual User? User { get; set; }

        [BsonIgnore]
        public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    }
}
