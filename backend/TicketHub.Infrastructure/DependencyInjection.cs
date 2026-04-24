using Microsoft.Extensions.DependencyInjection;
using TicketHub.Application.Abstractions.Commands;
using TicketHub.Application.Abstractions.Queries;
using TicketHub.Infrastructure.Repositories.Commands;
using TicketHub.Infrastructure.Repositories.Queries;

namespace TicketHub.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IEventQueryRepository, EventQueryRepository>();
        services.AddScoped<IEventCategoryQueryRepository, EventCategoryQueryRepository>();
        services.AddScoped<ITicketQueryRepository, TicketQueryRepository>();
        services.AddScoped<ITicketEntryQueryRepository, TicketEntryQueryRepository>();
        services.AddScoped<ITicketEntryCommandRepository, TicketEntryCommandRepository>();
        services.AddScoped<ITicketDetailQueryRepository, TicketDetailQueryRepository>();
        services.AddScoped<ITicketDetailCommandRepository, TicketDetailCommandRepository>();
        services.AddScoped<ITicketEntryDetailQueryRepository, TicketEntryDetailQueryRepository>();
        services.AddScoped<ITicketEntryDetailCommandRepository, TicketEntryDetailCommandRepository>();
        return services;
    }
}