using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace BaseCore.Entities
{
    public class OrderDetail
    {
        [BsonId]
        public int Id { get; set; }

        public int OrderId { get; set; }

        public int ProductId { get; set; }
        public int VariantId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        [BsonIgnore]
        public virtual Order? Order { get; set; }

        [BsonIgnore]
        public virtual Product? Product { get; set; }

        [BsonIgnore]
        public virtual ProductVariant? Variant { get; set; }
    }
}
