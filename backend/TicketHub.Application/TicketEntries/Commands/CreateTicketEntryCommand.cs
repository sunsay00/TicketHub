using MediatR;
using TicketHub.Application.Abstractions.Commands;
using TicketHub.Application.Abstractions.Queries;
using TicketHub.Db;
using TicketHub.Shared;

namespace TicketHub.Application.TicketEntries.Commands;

public sealed record CreateTicketEntryCommand(UpsertTicketEntryRequest Request) : IRequest;

internal sealed class CreateUserTicketEntryCommandHandler(
    ITicketEntryCommandRepository repository,
    ITicketDetailCommandRepository ticketDetailCommandRepository,
    TicketHubDbContext dbContext)
    : IRequestHandler<CreateTicketEntryCommand>
{
    public async Task Handle(CreateTicketEntryCommand request, CancellationToken cancellationToken)
    {
        var entity = new TicketEntry
        {
            EventId = request.Request.EventId,
            UserId = request.Request.UserId,
            NumberOfTickets = request.Request.NumberOfTickets,
            Status = TicketEntryStatus.New.ToString(),
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow,
            CreatedBy = request.Request.UserId.ToString(),
            UpdatedBy = request.Request.UserId.ToString()
        };

        var strategy = dbContext.Database.CreateExecutionStrategy();

        await strategy.ExecuteAsync(
            state: request,
            operation: async (_, _, ct) =>
            {
                await using var transaction = await dbContext.Database.BeginTransactionAsync(ct);

                var createdId = await repository.AddAsync(entity, ct);
                List<TicketDetail> ticketDetails = new List<TicketDetail>();
                for (var i = 0; i < request.Request.TicketDetails.Count; i++)
                {
                    ticketDetails.Add(new TicketDetail
                    {
                        ParentUserId = request.Request.UserId,
                        UserId = request.Request.UserId,
                        Status = TicketEntryStatus.New.ToString(),
                        Info = request.Request.TicketDetails[i].Info,
                        TicketEntryId = createdId,
                        CreatedAt = DateTimeOffset.UtcNow,
                        UpdatedAt = DateTimeOffset.UtcNow,
                        CreatedBy = request.Request.UserId.ToString(),
                        UpdatedBy = request.Request.UserId.ToString()
                    });
                }

                if (ticketDetails.Count > 0)
                {
                    await ticketDetailCommandRepository.AddAsync(ticketDetails, ct);
                }

                await transaction.CommitAsync(ct);

                return createdId;
            },
            verifySucceeded: null,
            cancellationToken: cancellationToken);
    }
}
