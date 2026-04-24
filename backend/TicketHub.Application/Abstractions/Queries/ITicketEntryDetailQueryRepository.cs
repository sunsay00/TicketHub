using TicketHub.Db;

namespace TicketHub.Application.Abstractions.Queries;

public interface ITicketEntryDetailQueryRepository
{
    Task<IReadOnlyList<TicketEntryDetail>> GetByTicketEntryIdAsync(long ticketEntryId, CancellationToken cancellationToken = default);
}

public sealed record TicketEntryDetailDto(
    long Id,
    long TicketEntryId,
    string Choice,
    string Status);

public sealed record CreateTicketEntryDetailRequest(
    long TicketEntryId,
    string Choice,
    string? Status);

public sealed record UpdateTicketEntryDetailsRequest(
    List<string> Choices);