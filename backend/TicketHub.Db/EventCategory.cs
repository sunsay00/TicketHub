using System.ComponentModel.DataAnnotations.Schema;

namespace TicketHub.Db;

[Table("event_categories")]
public class EventCategory : AuditBase
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", Order = 0)]
    public int EventCategoryId { get; set; }

    [Column("event_category_name", TypeName = "varchar(255)")]
    public string EventCategoryName { get; set; }
}