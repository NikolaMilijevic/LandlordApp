namespace LandlordApi.Models;

public class Tenant
{
    public Guid Id { get; set; }
    public Guid UnitId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime LeaseStart { get; set; }
    public DateTime LeaseEnd { get; set; }
    public decimal Deposit { get; set; }
    public int RentDueDay { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Unit Unit { get; set; } = null!;
    public ICollection<RentRecord> RentRecords { get; set; } = new List<RentRecord>();
}