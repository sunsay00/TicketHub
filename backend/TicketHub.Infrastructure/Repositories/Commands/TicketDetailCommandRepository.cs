using TicketHub.Application.Abstractions.Commands;
using TicketHub.Db;

namespace TicketHub.Infrastructure.Repositories.Commands;

internal sealed class TicketDetailCommandRepository(TicketHubDbContext db) : ITicketDetailCommandRepository
{
    public async Task AddAsync(List<TicketDetail> ticketDetails, CancellationToken cancellationToken = default)
    {
        db.TicketDetails.AddRange(ticketDetails);
        await db.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(List<TicketDetail> ticketDetails, CancellationToken cancellationToken = default)
    {
        db.TicketDetails.UpdateRange(ticketDetails);
        await db.SaveChangesAsync(cancellationToken);
    }
}