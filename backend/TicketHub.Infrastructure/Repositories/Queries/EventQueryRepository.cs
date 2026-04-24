using Microsoft.EntityFrameworkCore;
using TicketHub.Application.Abstractions.Queries;
using TicketHub.Db;
using TicketHub.Shared;

namespace TicketHub.Infrastructure.Repositories.Queries;

internal sealed class EventQueryRepository(TicketHubDbContext db) : IEventQueryRepository
{
    public async Task<IReadOnlyList<Event>> GetAllValidEvents(CancellationToken cancellationToken = default)
    {
        return await db.Events
            .AsNoTracking()
            .Where(e => e.Status == EventStatus.New.ToString())
            .OrderBy(e => e.EventDate)
            .ThenBy(e => e.EventName)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Event>> GetByIdAsync(List<long> ids, CancellationToken cancellationToken = default)
    {
        return await db.Events.AsNoTracking().Where(e => ids.Contains(e.Id)).ToListAsync(cancellationToken);
    }
}