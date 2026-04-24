using MediatR;
using TicketHub.Application.Abstractions.Queries;

namespace TicketHub.Application.TicketEntries.Queries;

public sealed record GetUserTicketEntriesQuery(long UserId) : IRequest<IReadOnlyList<TicketEntryDto>>;

internal sealed class GetUserTicketEntriesQueryHandler(
    ITicketEntryQueryRepository repository,
    IEventQueryRepository eventQueryRepository)
    : IRequestHandler<GetUserTicketEntriesQuery, IReadOnlyList<TicketEntryDto>>
{
    public async Task<IReadOnlyList<TicketEntryDto>> Handle(
        GetUserTicketEntriesQuery request,
        CancellationToken cancellationToken)
    {
        var entries = await repository.GetByUserIdAsync(request.UserId, cancellationToken);
        var eventIds = entries.Select(e => e.EventId).Distinct().ToList();
        var events = await eventQueryRepository.GetByIdAsync(eventIds, cancellationToken);

        return entries
            .Join(
                events,
                entry => entry.EventId,
                evt => evt.Id,
                (entry, evt) => new TicketEntryDto(
                    entry.Id,
                    entry.EventId,
                    entry.NumberOfTickets,
                    evt.EventName,
                    evt.City,
                    string.Concat(evt.EventDate, " ", evt.EventTime),
                    evt.DrawingDate.ToShortDateString(),
                    entry.Status))
            .ToList();
    }
}