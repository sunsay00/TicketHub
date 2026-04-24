using TicketHub.Application.Abstractions.Commands;
using TicketHub.Db;

namespace TicketHub.Infrastructure.Repositories.Commands;

internal sealed class TicketEntryCommandRepository(TicketHubDbContext db) : ITicketEntryCommandRepository
{
    public async Task<long> AddAsync(TicketEntry ticketEntry, CancellationToken cancellationToken = default)
    {
        db.TicketEntries.Add(ticketEntry);
        await db.SaveChangesAsync(cancellationToken);
        return ticketEntry.Id;
    }

    public async Task UpdateAsync(TicketEntry ticketEntry, CancellationToken cancellationToken = default)
    {
        db.TicketEntries.Update(ticketEntry);
        await db.SaveChangesAsync(cancellationToken);
    }
}