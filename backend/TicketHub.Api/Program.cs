using TicketHub.Application;
using TicketHub.Db;
using TicketHub.Infrastructure;
using TicketHub.Api;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.AddNpgsqlDbContext<TicketHubDbContext>("tickethub");

builder.Services.AddApplication();
builder.Services.AddInfrastructure();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .SetIsOriginAllowed(_ => true)
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}
else
{
    app.UseExceptionHandler();
}

app.UseCors();
app.MapEventApi();
app.MapTicketApi();
app.MapTicketEntryApi();
app.MapDefaultEndpoints();

app.Run();