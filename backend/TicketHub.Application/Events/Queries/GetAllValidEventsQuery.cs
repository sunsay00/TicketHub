using MediatR;
using TicketHub.Application.Abstractions.Queries;

namespace TicketHub.Application.Events.Queries;

public sealed record GetAllValidEventsQuery : IRequest<IReadOnlyList<EventDto>>;

internal sealed class GetAllValidEventsQueryHandler(
    IEventQueryRepository repository,
    IEventCategoryQueryRepository eventCategoryRepository)
    : IRequestHandler<GetAllValidEventsQuery, IReadOnlyList<EventDto>>
{
    public async Task<IReadOnlyList<EventDto>> Handle(
        GetAllValidEventsQuery request,
        CancellationToken cancellationToken)
    {
        var events = await repository.GetAllValidEvents(cancellationToken);
        var categories = await eventCategoryRepository.GetAllAsync(cancellationToken);

        return events
            .Join(
                categories,
                e => e.EventCategoryId,
                c => c.EventCategoryId,
                (e, c) => new EventDto(
                    e.Id,
                    e.EventName,
                    e.Performer,
                    e.Venue,
                    e.City,
                    e.Country,
                    e.EventDate,
                    e.EventTime,
                    e.DrawingDate,
                    c.EventCategoryName,
                    e.Status))
            .ToList();
    }
}