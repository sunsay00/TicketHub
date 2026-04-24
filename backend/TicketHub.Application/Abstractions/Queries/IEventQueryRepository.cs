using TicketHub.Db;

namespace TicketHub.Application.Abstractions.Queries;

public interface IEventQueryRepository
{
    Task<IReadOnlyList<Event>> GetAllValidEvents(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Event>> GetByIdAsync(List<long> ids, CancellationToken cancellationToken = default);
}

public sealed record EventDto(
    long Id,
    string EventName,
    string Performer,
    string Venue,
    string City,
    string Country,
    DateOnly EventDate,
    string EventTime,
    DateOnly DrawingDate,
    string Category,
    string Status);