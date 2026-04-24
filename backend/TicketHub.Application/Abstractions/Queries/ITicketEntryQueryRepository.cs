using TicketHub.Db;

namespace TicketHub.Application.Abstractions.Queries;

public interface ITicketEntryQueryRepository
{
    Task<IReadOnlyList<TicketEntry>> GetByUserIdAsync(long userId, CancellationToken cancellationToken = default);
    Task<TicketEntry?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
}

public sealed record TicketEntryDto(
    long Id,
    long EventId,
    int NumberOfTickets,
    string EventName,
    string City,
    string EventTime,
    string DrawingTime,
    string Status);

public sealed record UpsertTicketEntryRequest(
    long UserId,
    long EventId,
    int NumberOfTickets,
    List<string> Choices,
    List<TicketDetail> TicketDetails);