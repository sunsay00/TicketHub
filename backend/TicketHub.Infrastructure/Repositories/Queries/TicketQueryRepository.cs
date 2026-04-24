using Microsoft.EntityFrameworkCore;
using TicketHub.Application.Abstractions.Queries;
using TicketHub.Db;
using TicketHub.Shared;

namespace TicketHub.Infrastructure.Repositories.Queries;


internal sealed class TicketQueryRepository(TicketHubDbContext db) : ITicketQueryRepository
{
    public async Task<IReadOnlyList<TicketEntry>> GetByUserIdAsync(long userId, CancellationToken cancellationToken = default)
    {
        return await db.TicketEntries
            .AsNoTracking()
            .Where(t => t.UserId == userId && t.Status == TicketEntryStatus.Won.ToString())
            .OrderByDescending(t => t.Id)
            .ToListAsync(cancellationToken);
    }
}