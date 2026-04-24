using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using TicketHub.Application.Abstractions.Queries;
using TicketHub.Application.TicketEntries.Commands;
using TicketHub.Application.TicketEntries.Queries;

namespace TicketHub.Api;

public static class TicketEntryApi
{
    public static IEndpointRouteBuilder MapTicketEntryApi(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/ticketentry/{userId:long}").WithTags("TicketEntries");

        group.MapGet("/ticket-entries", GetUserTicketEntriesAsync)
            .Produces<IReadOnlyList<TicketEntryDto>>(StatusCodes.Status200OK);

        group.MapGet("/ticket-entries/{ticketEntryId:long}", GetTicketEntryByIdAsync)
            .Produces<TicketEntryDto>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPut("/ticket-entries/{ticketEntryId:long}", UpdateTicketEntryAsync)
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPost("/ticket-entries", CreateTicketEntryAsync)
            .Produces(StatusCodes.Status204NoContent);

        return app;
    }

    private static async Task<Ok<IReadOnlyList<TicketEntryDto>>> GetUserTicketEntriesAsync(
        long userId,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var data = await sender.Send(new GetUserTicketEntriesQuery(userId), cancellationToken);
        return TypedResults.Ok(data);
    }

    private static async Task<NoContent> CreateTicketEntryAsync(
        long userId,
        UpsertTicketEntryRequest request,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var commandRequest = request with { UserId = userId };
        await sender.Send(new CreateTicketEntryCommand(commandRequest), cancellationToken);
        return TypedResults.NoContent();
    }

    private static async Task<Results<Ok<TicketEntryDto>, NotFound>> GetTicketEntryByIdAsync(
        long userId,
        long ticketEntryId,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var data = await sender.Send(new GetTicketEntryByIdQuery(userId, ticketEntryId), cancellationToken);
        return data is null ? TypedResults.NotFound() : TypedResults.Ok(data);
    }

    private static async Task<Results<NoContent, NotFound>> UpdateTicketEntryAsync(
        long userId,
        long ticketEntryId,
        UpsertTicketEntryRequest request,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var commandRequest = request with { UserId = userId };
        var updated = await sender.Send(new UpdateTicketEntryCommand(ticketEntryId, commandRequest), cancellationToken);
        return updated ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}