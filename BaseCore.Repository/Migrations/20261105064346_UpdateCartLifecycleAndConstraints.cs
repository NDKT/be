using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BaseCore.Repository.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCartLifecycleAndConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Carts_UserId",
                table: "Carts");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Carts",
                type: "nvarchar(36)",
                maxLength: 36,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(36)",
                oldMaxLength: 36,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Carts",
                type: "datetime2(7)",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<int>(
                name: "OrderId",
                table: "Carts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PaidAt",
                table: "Carts",
                type: "datetime2(7)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Carts",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Active");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Carts",
                type: "datetime2(7)",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.CreateIndex(
                name: "IX_Carts_OrderId",
                table: "Carts",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Carts_UserId_Active",
                table: "Carts",
                column: "UserId",
                unique: true,
                filter: "[Status] = 'Active'");

            migrationBuilder.CreateIndex(
                name: "IX_Carts_UserId_Status",
                table: "Carts",
                columns: new[] { "UserId", "Status" });

            migrationBuilder.AddCheckConstraint(
                name: "CK_Carts_Status",
                table: "Carts",
                sql: "[Status] IN ('Active', 'Paid', 'Abandoned')");

            migrationBuilder.AddForeignKey(
                name: "FK_Carts_Orders_OrderId",
                table: "Carts",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Carts_Orders_OrderId",
                table: "Carts");

            migrationBuilder.DropIndex(
                name: "IX_Carts_OrderId",
                table: "Carts");

            migrationBuilder.DropIndex(
                name: "IX_Carts_UserId_Active",
                table: "Carts");

            migrationBuilder.DropIndex(
                name: "IX_Carts_UserId_Status",
                table: "Carts");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Carts_Status",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "OrderId",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "PaidAt",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Carts");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Carts",
                type: "nvarchar(36)",
                maxLength: 36,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(36)",
                oldMaxLength: 36);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Carts",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.CreateIndex(
                name: "IX_Carts_UserId",
                table: "Carts",
                column: "UserId");
        }
    }
}
