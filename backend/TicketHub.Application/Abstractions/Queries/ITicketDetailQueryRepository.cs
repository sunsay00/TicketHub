using TicketHub.Db;

namespace TicketHub.Application.Abstractions.Queries;

public interface ITicketDetailQueryRepository
{
    Task<IReadOnlyList<TicketDetail>> GetByTicketEntryIdAsync(long ticketEntryId, CancellationToken cancellationToken = default);
    Task<TicketDetail?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
}
