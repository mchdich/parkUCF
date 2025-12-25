using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace ParkUCF.Models
{
    [Table("metrics")]
    class Metrics : BaseModel
    {
        [PrimaryKey("one")]
        public int One { get; set; }

        [Column("time")]
        public string? Time { get; set; }

        [Column("timeval")]
        public string? Timeval { get; set; }

        [Column("garage")]
        public string? Garage { get; set; }

        [Column("garageval")]
        public string? Garageval { get; set; }

        [Column("maxsum")]
        public string? Maxsum { get; set; }

        [Column("maxval")]
        public string? Maxval { get; set; }

        [Column("poc")]
        public string? Poc { get; set; }
    }
}