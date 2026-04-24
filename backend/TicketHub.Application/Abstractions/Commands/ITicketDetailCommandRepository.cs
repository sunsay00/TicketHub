using TicketHub.Db;

namespace TicketHub.Application.Abstractions.Commands;

public interface ITicketDetailCommandRepository
{
    Task AddAsync(List<TicketDetail> ticketDetails, CancellationToken cancellationToken = default);
    Task UpdateAsync(List<TicketDetail> ticketDetails, CancellationToken cancellationToken = default);
}

public sealed record CreateTicketDetailRequest(
    long TicketId,
    long TicketEntryId,
    string Location,
    string? Status);