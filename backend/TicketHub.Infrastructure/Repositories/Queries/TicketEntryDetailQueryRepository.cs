using Microsoft.EntityFrameworkCore;
using TicketHub.Application.Abstractions.Queries;
using TicketHub.Db;

namespace TicketHub.Infrastructure.Repositories.Queries;


internal sealed class TicketEntryDetailQueryRepository(TicketHubDbContext db) : ITicketEntryDetailQueryRepository
{
    public async Task<IReadOnlyList<TicketEntryDetail>> GetByTicketEntryIdAsync(long ticketEntryId, CancellationToken cancellationToken = default)
    {
        return await db.TicketEntryDetails
            .AsNoTracking()
            .Where(d => d.TicketEntryId == ticketEntryId)
            .OrderByDescending(d => d.Id)
            .ToListAsync(cancellationToken);
    }
}