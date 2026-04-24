using Microsoft.EntityFrameworkCore;

namespace TicketHub.Db;

public class TicketHubDbContext : DbContext
{
    public DbSet<Event> Events { get; set; }
    public DbSet<EventCategory> EventCategories { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<TicketEntry> TicketEntries { get; set; }
    public DbSet<TicketEntryDetail> TicketEntryDetails { get; set; }
    public DbSet<TicketDetail> TicketDetails { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TicketHubDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}