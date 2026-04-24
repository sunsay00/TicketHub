using System.ComponentModel.DataAnnotations.Schema;

namespace TicketHub.Db;

[Table("ticket_entries")]
public class TicketEntry : AuditBase
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", Order = 0)]
    public long Id { get; set; }
    [Column("event_id")]
    public long EventId { get; set; }
    [Column("user_id")]
    public long UserId { get; set; }
    [Column("number_of_tickets")]
    public int NumberOfTickets { get; set; }
    [Column("status")]
    public string Status { get; set; }
}