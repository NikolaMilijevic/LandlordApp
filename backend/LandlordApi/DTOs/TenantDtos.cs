namespace LandlordApi.DTOs;

public record CreateTenantDto(
    Guid UnitId,
    string Name,
    string Email,
    string Phone,
    DateTime LeaseStart,
    DateTime LeaseEnd,
    decimal Deposit,
    int RentDueDay
);

public record UpdateTenantDto(
    string Name,
    string Email,
    string Phone,
    DateTime LeaseStart,
    DateTime LeaseEnd,
    decimal Deposit,
    int RentDueDay
);

public record TenantResponseDto(
    Guid Id,
    Guid UnitId,
    string Name,
    string Email,
    string Phone,
    DateTime LeaseStart,
    DateTime LeaseEnd,
    decimal Deposit,
    int RentDueDay,
    DateTime CreatedAt
);