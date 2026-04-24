using MediatR;
using TicketHub.Application.Abstractions.Queries;

namespace TicketHub.Application.TicketEntries.Queries;

public sealed record GetTicketEntryByIdQuery(long UserId, long TicketEntryId) : IRequest<TicketEntryDto?>;

internal sealed class GetTicketEntryByIdQueryHandler(
    ITicketEntryQueryRepository ticketEntryQueryRepository,
    IEventQueryRepository eventQueryRepository)
    : IRequestHandler<GetTicketEntryByIdQuery, TicketEntryDto?>
{
    public async Task<TicketEntryDto?> Handle(GetTicketEntryByIdQuery request, CancellationToken cancellationToken)
    {
        var entry = await ticketEntryQueryRepository.GetByIdAsync(request.TicketEntryId, cancellationToken);
        if (entry is null || entry.UserId != request.UserId)
        {
            return null;
        }

        var evt = (await eventQueryRepository.GetByIdAsync([entry.EventId], cancellationToken)).FirstOrDefault();

        return new TicketEntryDto(
            entry.Id,
            entry.EventId,
            entry.NumberOfTickets,
            evt?.EventName ?? string.Empty,
            evt?.City ?? string.Empty,
            evt is null ? string.Empty : string.Concat(evt.EventDate, " ", evt.EventTime),
            evt?.DrawingDate.ToShortDateString() ?? string.Empty,
            entry.Status);
    }
}