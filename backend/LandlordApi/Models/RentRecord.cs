namespace LandlordApi.Models;

public class RentRecord
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public DateTime Month { get; set; }
    public decimal AmountDue { get; set; }
    public decimal? AmountPaid { get; set; }
    public DateTime? PaidAt { get; set; }
    public string Status { get; set; } = "overdue";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Tenant Tenant { get; set; } = null!;
}