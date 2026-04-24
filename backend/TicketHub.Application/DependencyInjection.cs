using Microsoft.Extensions.DependencyInjection;
using TicketHub.Application.TicketEntries.Queries;

namespace TicketHub.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(GetTicketEntryByIdQueryHandler).Assembly));

        return services;
    }
}