using MediatR;
using TicketHub.Application.Abstractions.Commands;
using TicketHub.Application.Abstractions.Queries;

namespace TicketHub.Application.TicketDetails.Commands;

public sealed record UpdateTicketDetailRequest(
    string TicketNumber,
    string Info,
    string Location,
    string? Status);

public sealed record UpdateTicketDetailCommand(
    long UserId,
    long TicketDetailId,
    UpdateTicketDetailRequest Request) : IRequest<bool>;

internal sealed class UpdateUserTicketDetailCommandHandler(
    ITicketDetailQueryRepository ticketDetailQueryRepository,
    ITicketDetailCommandRepository ticketDetailCommandRepository)
    : IRequestHandler<UpdateTicketDetailCommand, bool>
{
    public async Task<bool> Handle(UpdateTicketDetailCommand request, CancellationToken cancellationToken)
    {
        var detail = await ticketDetailQueryRepository.GetByIdAsync(request.TicketDetailId, cancellationToken);
        if (detail is null || detail.UserId != request.UserId)
        {
            return false;
        }

        detail.TicketNumber = request.Request.TicketNumber;
        detail.Info = request.Request.Info;
        detail.Location = request.Request.Location;

        if (!string.IsNullOrWhiteSpace(request.Request.Status))
        {
            detail.Status = request.Request.Status;
        }

        detail.UpdatedAt = DateTimeOffset.UtcNow;
        detail.UpdatedBy = request.UserId.ToString();

        await ticketDetailCommandRepository.UpdateAsync([detail], cancellationToken);
        return true;
    }
}