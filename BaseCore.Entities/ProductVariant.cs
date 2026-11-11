using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Entities
{
    public class ProductVariant
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string Size { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public int Stock { get; set; } = 0;
        public decimal? Price { get; set; }
        public string? SKU { get; set; }
        public string? ImageUrl { get; set; }
        public virtual Product? Product { get; set; }
    }
}
