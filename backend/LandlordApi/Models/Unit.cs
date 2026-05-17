namespace LandlordApi.Models;

public class Unit
{
    public Guid Id { get; set; }
    public Guid PropertyId { get; set; }
    public string Label { get; set; } = string.Empty;
    public decimal MonthlyRent { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Property Property { get; set; } = null!;
    public ICollection<Tenant> Tenants { get; set; } = new List<Tenant>();
}