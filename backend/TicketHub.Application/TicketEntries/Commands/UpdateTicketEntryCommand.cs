using MediatR;
using TicketHub.Application.Abstractions.Commands;
using TicketHub.Application.Abstractions.Queries;
using TicketHub.Db;
using TicketHub.Shared;

namespace TicketHub.Application.TicketEntries.Commands;

public sealed record UpdateTicketEntryCommand(
    long TicketEntryId,
    UpsertTicketEntryRequest Request) : IRequest<bool>;

internal sealed class UpdateUserTicketEntryCommandHandler(
    ITicketEntryQueryRepository ticketEntryQueryRepository,
    ITicketEntryCommandRepository ticketEntryCommandRepository,
    ITicketDetailQueryRepository ticketDetailQueryRepository,
    ITicketDetailCommandRepository ticketDetailCommandRepository,
    TicketHubDbContext dbContext)
    : IRequestHandler<UpdateTicketEntryCommand, bool>
{
    public async Task<bool> Handle(UpdateTicketEntryCommand request, CancellationToken cancellationToken)
    {
        var existing = await ticketEntryQueryRepository.GetByIdAsync(request.TicketEntryId, cancellationToken);
        if (existing is null)
        {
            return false;
        }

        var now = DateTimeOffset.UtcNow;

        existing.NumberOfTickets = request.Request.NumberOfTickets;
        existing.UpdatedAt = now;
        existing.UpdatedBy = request.Request.UserId.ToString();

        var strategy = dbContext.Database.CreateExecutionStrategy();

        await strategy.ExecuteAsync(
            state: request,
            operation: async (_, _, ct) =>
            {
                await using var transaction = await dbContext.Database.BeginTransactionAsync(ct);

                await ticketEntryCommandRepository.UpdateAsync(existing, cancellationToken);
                await UpsertTicketDetails(request, now, ct);

                await transaction.CommitAsync(ct);
                return true;
            },
            verifySucceeded: null,
            cancellationToken: cancellationToken);

        return true;
    }

    private async Task UpsertTicketDetails(UpdateTicketEntryCommand request, DateTimeOffset now, CancellationToken ct)
    {
        var normalizedInfos = request.Request.TicketDetails
            .Where(c => !string.IsNullOrWhiteSpace(c.Info))
            .Select(c => c.Info.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
        
        var existingDetails = await ticketDetailQueryRepository.GetByTicketEntryIdAsync(request.TicketEntryId);

        var existingInfoSet = existingDetails
            .Select(d => d.Info)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
        
        var requestedInfoSet = normalizedInfos.ToHashSet(StringComparer.OrdinalIgnoreCase);

        var toDelete = existingDetails
            .Where(d => !requestedInfoSet.Contains(d.Info))
            .ToList();

        foreach (var detail in toDelete)
        {
            detail.Status = TicketEntryStatus.Deleted.ToString();
            detail.UpdatedAt = now;
            detail.UpdatedBy = request.Request.UserId.ToString();
        }

        var toRestore = existingDetails
            .Where(d => requestedInfoSet.Contains(d.Info) && d.Status == TicketEntryStatus.Deleted.ToString())
            .ToList();

        foreach (var detail in toRestore)
        {
            detail.Status = TicketEntryStatus.New.ToString();
            detail.UpdatedAt = now;
            detail.UpdatedBy = request.Request.UserId.ToString();
        }

        var toInsert = normalizedInfos
            .Where(info => !existingInfoSet.Contains(info))
            .Select(info => new TicketDetail
            {
                TicketEntryId = request.TicketEntryId,
                Info = info,
                Status = TicketEntryStatus.New.ToString(),
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow,
                CreatedBy = request.Request.UserId.ToString(),
                UpdatedBy = request.Request.UserId.ToString()
            })
            .ToList();

        var toUpdate = toDelete.Concat(toRestore).ToList();
        if (toUpdate.Count > 0)
        {
            await ticketDetailCommandRepository.UpdateAsync(toUpdate, ct);
        }

        if (toInsert.Count > 0)
        {
            await ticketDetailCommandRepository.AddAsync(toInsert, ct);
        }
    }
}