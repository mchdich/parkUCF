using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace ParkUCF.Models
{
    [Table("weekly")]
    class WeeklyDP : BaseModel
    {
        [PrimaryKey("id")]
        public string Id { get; set; }

        [Column("x")]
        public DateTimeOffset X { get; set; }

        [Column("y")]
        public float Y { get; set; }
    }
}