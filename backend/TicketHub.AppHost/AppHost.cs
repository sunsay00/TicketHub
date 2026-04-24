var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .WithPgAdmin()
    .WithLifetime(ContainerLifetime.Session);
if (builder.ExecutionContext.IsRunMode)
{
    postgres.WithDataVolume();
};
var db = postgres.AddDatabase("tickethub");
var dbManager = builder.AddProject<Projects.TicketHub_DbManager>("tickethubmanager")
    .WithReference(db)
    .WaitFor(db);

builder.AddProject<Projects.TicketHub_Api>("api")
    .WithReference(db)
    .WithReference(dbManager)
    .WaitFor(dbManager)
    .WithExternalHttpEndpoints();

builder.Build().Run();