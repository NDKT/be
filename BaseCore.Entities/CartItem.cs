using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Entities
{
    public class CartItem
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        public int VariantId { get; set; }
        public int Quantity { get; set; }

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
        public virtual Cart? Cart { get; set; }
        public virtual ProductVariant? Variant { get; set; }
    }
}
