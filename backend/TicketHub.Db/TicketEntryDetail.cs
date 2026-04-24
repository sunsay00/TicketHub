using System.ComponentModel.DataAnnotations.Schema;

namespace TicketHub.Db;

[Table("ticket_entry_details")]
public class TicketEntryDetail : AuditBase
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", Order = 0)]
    public long Id { get; set; }
    [Column("ticket_entry_id")]
    public long TicketEntryId { get; set; }
    [Column("choice")]
    public string Choice { get; set; }
    [Column("status")]
    public string Status { get; set; }
}