using TicketHub.Db;

namespace TicketHub.Application.Abstractions.Commands;

public interface ITicketEntryCommandRepository
{
    Task<long> AddAsync(TicketEntry ticketEntry, CancellationToken cancellationToken = default);
    Task UpdateAsync(TicketEntry ticketEntry, CancellationToken cancellationToken = default);
}