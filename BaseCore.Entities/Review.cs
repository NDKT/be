using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Entities
{
    public class Review
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int Rating { get; set; }

        public string? Comment { get; set; }

        public bool IsApproved { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public virtual Product? Product { get; set; }
        public virtual User? User { get; set; }
    }
}
