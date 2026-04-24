using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace TicketHub.DbManager.Migrations;

public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "event_categories",
            columns: table => new
            {
                id = table.Column<int>(type: "integer", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                event_category_name = table.Column<string>(type: "varchar(100)", nullable: false),
                created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                created_by = table.Column<string>(type: "varchar(100)", nullable: false),
                updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                updated_by = table.Column<string>(type: "varchar(100)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_EventCategories", x => x.id);
            });

        migrationBuilder.CreateTable(
            name: "events",
            columns: table => new
            {
                id = table.Column<long>(type: "bigint", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                event_category_id = table.Column<int>(type: "integer", nullable: false),
                event_name = table.Column<string>(type: "varchar(255)", nullable: false),
                performer = table.Column<string>(type: "varchar(255)", nullable: false),
                venue = table.Column<string>(type: "varchar(255)", nullable: false),
                city = table.Column<string>(type: "varchar(100)", nullable: false),
                country = table.Column<string>(type: "varchar(100)", nullable: false),
                event_date = table.Column<DateOnly>(type: "date", nullable: false),
                event_time = table.Column<string>(type: "varchar(20)", nullable: false),
                drawing_date = table.Column<DateOnly>(type: "date", nullable: false),
                status = table.Column<string>(type: "varchar(20)", nullable: false),
                created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                created_by = table.Column<string>(type: "varchar(100)", nullable: false),
                updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                updated_by = table.Column<string>(type: "varchar(100)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Events", x => x.id);
            });

        migrationBuilder.CreateTable(
            name: "ticket_details",
            columns: table => new
            {
                id = table.Column<long>(type: "bigint", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                ticket_entry_id = table.Column<long>(type: "bigint", nullable: false),
                parent_user_id = table.Column<long>(type: "bigint", nullable: false),
                user_id = table.Column<long>(type: "bigint", nullable: false),
                ticket_number = table.Column<string>(type: "text", nullable: false),
                info = table.Column<string>(type: "varchar(100)", nullable: false),
                location = table.Column<string>(type: "varchar(20)", nullable: false),
                status = table.Column<string>(type: "varchar(20)", nullable: false),
                created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                created_by = table.Column<string>(type: "varchar(100)", nullable: false),
                updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                updated_by = table.Column<string>(type: "varchar(100)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_TicketDetails", x => x.id);
            });

        migrationBuilder.CreateTable(
            name: "ticket_entries",
            columns: table => new
            {
                id = table.Column<long>(type: "bigint", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                event_id = table.Column<long>(type: "bigint", nullable: false),
                user_id = table.Column<long>(type: "bigint", nullable: false),
                number_of_tickets = table.Column<int>(type: "integer", nullable: false),
                status = table.Column<string>(type: "varchar(20)", nullable: false),
                created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                created_by = table.Column<string>(type: "varchar(100)", nullable: false),
                updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                updated_by = table.Column<string>(type: "varchar(100)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_TicketEntries", x => x.id);
            });

        migrationBuilder.CreateTable(
            name: "ticket_entry_details",
            columns: table => new
            {
                id = table.Column<long>(type: "bigint", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                ticket_entry_id = table.Column<long>(type: "bigint", nullable: false),
                choice = table.Column<string>(type: "varchar(20)", nullable: false),
                status = table.Column<string>(type: "varchar(20)", nullable: false),
                created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                created_by = table.Column<string>(type: "varchar(100)", nullable: false),
                updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                updated_by = table.Column<string>(type: "varchar(100)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_TicketEntryDetails", x => x.id);
            });

        migrationBuilder.CreateTable(
            name: "users",
            columns: table => new
            {
                id = table.Column<long>(type: "bigint", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                username = table.Column<string>(type: "varchar(255)", nullable: false),
                first_name = table.Column<string>(type: "varchar(255)", nullable: false),
                last_name = table.Column<string>(type: "varchar(255)", nullable: false),
                email = table.Column<string>(type: "varchar(512)", nullable: true),
                phone_number = table.Column<string>(type: "varchar(32)", nullable: true),
                created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                created_by = table.Column<string>(type: "varchar(100)", nullable: false),
                updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                updated_by = table.Column<string>(type: "varchar(100)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_users", x => x.id);
            });

        migrationBuilder.CreateIndex(
            name: "IX_users_phone_number",
            table: "users",
            column: "phone_number",
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_users_username",
            table: "users",
            column: "username",
            unique: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "event_categories");

        migrationBuilder.DropTable(
            name: "events");

        migrationBuilder.DropTable(
            name: "ticket_details");

        migrationBuilder.DropTable(
            name: "ticket_entries");

        migrationBuilder.DropTable(
            name: "ticket_entry_details");

        migrationBuilder.DropTable(
            name: "users");
    }
}