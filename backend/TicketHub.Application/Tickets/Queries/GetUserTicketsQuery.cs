using MediatR;
using TicketHub.Application.Abstractions.Queries;

namespace TicketHub.Application.Tickets.Queries;

public sealed record GetUserTicketsQuery(long UserId) : IRequest<IReadOnlyList<TicketDto>>;

internal sealed class GetUserTicketsQueryHandler(ITicketQueryRepository repository)
    : IRequestHandler<GetUserTicketsQuery, IReadOnlyList<TicketDto>>
{
    public async Task<IReadOnlyList<TicketDto>> Handle(
        GetUserTicketsQuery request,
        CancellationToken cancellationToken)
    {
        var tickets = await repository.GetByUserIdAsync(request.UserId, cancellationToken);

        return tickets
            .Select(t => new TicketDto(t.Id, t.EventId, t.UserId, t.Status))
            .ToList();
    }
}