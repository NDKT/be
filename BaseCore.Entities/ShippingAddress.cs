using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Entities
{
    public class ShippingAddress
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string ReceiverName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string Ward { get; set; } = string.Empty;
        public string DetailAddress { get; set; } = string.Empty;

        public bool IsDefault { get; set; } = false;
        public virtual User? User { get; set; }
    }
}
