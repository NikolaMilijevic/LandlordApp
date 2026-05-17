using Microsoft.EntityFrameworkCore;
using LandlordApi.Models;

namespace LandlordApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Property> Properties => Set<Property>();
    public DbSet<Unit> Units => Set<Unit>();
    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<RentRecord> RentRecords => Set<RentRecord>();
    public DbSet<MaintenanceRequest> MaintenanceRequests => Set<MaintenanceRequest>();
    public DbSet<Document> Documents => Set<Document>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("uuid-ossp");

        modelBuilder.Entity<Property>()
            .Property(p => p.Id)
            .HasDefaultValueSql("uuid_generate_v4()");

        modelBuilder.Entity<Unit>()
            .Property(u => u.Id)
            .HasDefaultValueSql("uuid_generate_v4()");

        modelBuilder.Entity<Tenant>()
            .Property(t => t.Id)
            .HasDefaultValueSql("uuid_generate_v4()");

        modelBuilder.Entity<RentRecord>()
            .Property(r => r.Id)
            .HasDefaultValueSql("uuid_generate_v4()");

        modelBuilder.Entity<MaintenanceRequest>()
            .Property(m => m.Id)
            .HasDefaultValueSql("uuid_generate_v4()");

        modelBuilder.Entity<Document>()
            .Property(d => d.Id)
            .HasDefaultValueSql("uuid_generate_v4()");
    }
}