using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using TicketHub.Application.Events.Queries;

namespace TicketHub.Api;

public static class EventApi
{
    public static IEndpointRouteBuilder MapEventApi(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/events").WithTags("Events");

        group.MapGet("/validevents", GetAllValidatedEventsAsync)
            .Produces(StatusCodes.Status200OK);

        return app;
    }

    private static async Task<Ok<object>> GetAllValidatedEventsAsync(
        ISender sender,
        CancellationToken cancellationToken)
    {
        var data = await sender.Send(new GetAllValidEventsQuery(), cancellationToken);
        return TypedResults.Ok((object)data);
    }
}