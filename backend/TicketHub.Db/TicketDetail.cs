using System.ComponentModel.DataAnnotations.Schema;

namespace TicketHub.Db;

[Table("ticket_details")]
public class TicketDetail : AuditBase
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", Order = 0)]
    public long Id { get; set; }
    [Column("ticket_entry_id")]
    public long TicketEntryId { get; set; }
    [Column("parent_user_id")]
    public long ParentUserId { get; set; }
    [Column("user_id")]
    public long UserId { get; set; }
    [Column("ticket_number")]
    public string TicketNumber { get; set; }
    [Column("info")]
    public string Info { get; set; }
    [Column("location")]
    public string Location { get; set; }
    [Column("status")]
    public string Status { get; set; }
}