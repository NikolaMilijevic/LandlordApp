namespace LandlordApi.Models;

public class RentalProperty
{
    public Guid Id { get; set; }
    public string ClerkUserId { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Unit> Units { get; set; } = new List<Unit>();
}