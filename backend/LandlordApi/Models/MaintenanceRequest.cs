namespace LandlordApi.Models;

public class MaintenanceRequest
{
    public Guid Id { get; set; }
    public Guid UnitId { get; set; }
    public Guid? TenantId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = "routine";
    public string Status { get; set; } = "open";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }
    public Unit Unit { get; set; } = null!;
}