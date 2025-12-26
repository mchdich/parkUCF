using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace ParkUCF.Models
{
    [Table("daily_log")]
    class DailyLog : BaseModel
    {
        [Column("name")]
        public string? Name { get; set; }

        [Column("available")]
        public int Available { get; set; }

        [Column("occupied")]
        public int Occupied { get; set; }

        [Column("total")]
        public int Total { get; set; }

        [Column("occupancy_rate")]
        public float OccupancyRate { get; set; }

        [Column("event_reserved")]
        public string? EventReserved { get; set; }

        [Column("event_name")]
        public string? EventName { get; set; }

        [Column("timestamp")]
        public string? Timestamp { get; set; }
    }
}