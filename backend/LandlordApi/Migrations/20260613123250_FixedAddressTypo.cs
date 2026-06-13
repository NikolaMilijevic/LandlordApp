using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LandlordApi.Migrations
{
    /// <inheritdoc />
    public partial class FixedAddressTypo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Adress",
                table: "Properties",
                newName: "Address");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Address",
                table: "Properties",
                newName: "Adress");
        }
    }
}
