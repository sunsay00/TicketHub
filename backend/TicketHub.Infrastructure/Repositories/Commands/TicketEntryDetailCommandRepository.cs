using TicketHub.Application.Abstractions.Commands;
using TicketHub.Db;

namespace TicketHub.Infrastructure.Repositories.Commands;

internal sealed class TicketEntryDetailCommandRepository(TicketHubDbContext db) : ITicketEntryDetailCommandRepository
{
    public async Task AddAsync(List<TicketEntryDetail> ticketEntryDetails, CancellationToken cancellationToken = default)
    {
        db.TicketEntryDetails.AddRange(ticketEntryDetails);
        await db.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(List<TicketEntryDetail> ticketEntryDetails, CancellationToken cancellationToken = default)
    {
        db.TicketEntryDetails.UpdateRange(ticketEntryDetails);
        await db.SaveChangesAsync(cancellationToken);
    }
}