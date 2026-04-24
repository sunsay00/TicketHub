using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using TicketHub.Application.Abstractions.Queries;
using TicketHub.Application.TicketDetails.Commands;
using TicketHub.Application.Tickets.Queries;

namespace TicketHub.Api;

public static class TicketApi
{
    public static IEndpointRouteBuilder MapTicketApi(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/ticket/{userId:long}").WithTags("Tickets");

        group.MapGet("/tickets", GetUserTicketsAsync)
            .Produces<IReadOnlyList<TicketDto>>(StatusCodes.Status200OK);

        group.MapPut("/ticket-details/{ticketDetailId:long}", UpdateTicketDetailAsync)
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        return app;
    }

    private static async Task<Ok<IReadOnlyList<TicketDto>>> GetUserTicketsAsync(
        long userId,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var data = await sender.Send(new GetUserTicketsQuery(userId), cancellationToken);
        return TypedResults.Ok(data);
    }

    private static async Task<Results<NoContent, NotFound>> UpdateTicketDetailAsync(
        long userId,
        long ticketDetailId,
        UpdateTicketDetailRequest request,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var updated = await sender.Send(new UpdateTicketDetailCommand(userId, ticketDetailId, request), cancellationToken);
        return updated ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}