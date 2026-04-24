using System.ComponentModel.DataAnnotations.Schema;

namespace TicketHub.Db;

[Table("events")]
public class Event : AuditBase
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", Order = 0)]
    public long Id { get; set; }
    [Column("event_category_id")]
    public int EventCategoryId { get; set; }
    [Column("event_name", TypeName = "varchar(255)")]
    public string EventName { get; set; }
    [Column("performer", TypeName = "varchar(255)")]
    public string Performer { get; set; }
    [Column("venue", TypeName = "varchar(255)")]
    public string Venue { get; set; }
    [Column("city", TypeName = "varchar(255)")]
    public string City { get; set; }
    [Column("country", TypeName = "varchar(255)")]
    public string Country { get; set; }
    [Column("event_date")]
    public DateOnly EventDate { get; set; }
    [Column("evemt_time")]
    public string EventTime { get; set; }
    [Column("drawing_date")]
    public DateOnly DrawingDate { get; set; }
    [Column("status", TypeName = "varchar(255)")]
    public string Status { get; set; }
}