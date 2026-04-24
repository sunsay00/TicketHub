using TicketHub.Db;
using TicketHub.Application.Abstractions.Queries;
using Microsoft.EntityFrameworkCore;

namespace TicketHub.Infrastructure.Repositories.Queries;

internal sealed class EventCategoryQueryRepository(TicketHubDbContext db) : IEventCategoryQueryRepository
{
    public async Task<IReadOnlyList<EventCategory>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.EventCategories
            .AsNoTracking()
            .OrderBy(x => x.EventCategoryName)
            .ToListAsync(cancellationToken);
    }

    public async Task<EventCategory?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await db.EventCategories
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.EventCategoryId == id, cancellationToken);
    }
}
