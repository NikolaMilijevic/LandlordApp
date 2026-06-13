namespace LandlordApi.Models;

public class Document
{
    public Guid Id { get; set; }
    public Guid PropertyId { get; set; }
    public Guid? TenantId { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public DateTime? ExpiryDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public RentalProperty Property { get; set; } = null!;
}