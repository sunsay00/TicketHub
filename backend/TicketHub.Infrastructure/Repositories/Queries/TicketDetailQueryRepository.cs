using Microsoft.EntityFrameworkCore;
using TicketHub.Application.Abstractions.Queries;
using TicketHub.Db;

namespace TicketHub.Infrastructure.Repositories.Queries;

internal sealed class TicketDetailQueryRepository(TicketHubDbContext db) : ITicketDetailQueryRepository
{
    public async Task<IReadOnlyList<TicketDetail>> GetByTicketEntryIdAsync(long ticketEntryId, CancellationToken cancellationToken = default)
    {
        return await db.TicketDetails
            .AsNoTracking()
            .Where(d => d.TicketEntryId == ticketEntryId)
            .OrderByDescending(d => d.Id)
            .ToListAsync(cancellationToken);
    }

    public async Task<TicketDetail?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return await db.TicketDetails
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);
    }
}
