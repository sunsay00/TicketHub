using Microsoft.EntityFrameworkCore;
using TicketHub.Application.Abstractions.Queries;
using TicketHub.Db;

namespace TicketHub.Infrastructure.Repositories.Queries;

internal sealed class TicketEntryQueryRepository(TicketHubDbContext db) : ITicketEntryQueryRepository
{
    public async Task<IReadOnlyList<TicketEntry>> GetByUserIdAsync(long userId, CancellationToken cancellationToken = default)
    {
        return await db.TicketEntries
            .AsNoTracking()
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.Id)
            .ToListAsync(cancellationToken);
    }

    public async Task<TicketEntry?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return await db.TicketEntries
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }
}
