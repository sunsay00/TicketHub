using TicketHub.Db;

namespace TicketHub.Application.Abstractions.Queries;

public interface ITicketQueryRepository
{
    Task<IReadOnlyList<TicketEntry>> GetByUserIdAsync(long userId, CancellationToken cancellationToken = default);
}

public sealed record TicketDto(
    long Id,
    long EventId,
    long UserId,
    string Status);