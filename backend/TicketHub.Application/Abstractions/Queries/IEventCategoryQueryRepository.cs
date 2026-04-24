using TicketHub.Db;

namespace TicketHub.Application.Abstractions.Queries;

public interface IEventCategoryQueryRepository
{
    Task<IReadOnlyList<EventCategory>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<EventCategory?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
}
