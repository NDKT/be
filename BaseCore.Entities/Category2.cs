using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseCore.Entities
{
    public class Category2
    {
        [BsonId]
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
    }
}
