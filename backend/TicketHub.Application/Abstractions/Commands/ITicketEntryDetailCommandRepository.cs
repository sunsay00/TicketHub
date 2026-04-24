using TicketHub.Db;

namespace TicketHub.Application.Abstractions.Commands;

public interface ITicketEntryDetailCommandRepository
{
    Task AddAsync(List<TicketEntryDetail> ticketEntryDetails, CancellationToken cancellationToken = default);
    Task UpdateAsync(List<TicketEntryDetail> ticketEntryDetails, CancellationToken cancellationToken = default);
}
