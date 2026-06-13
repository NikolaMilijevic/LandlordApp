namespace LandlordApi.DTOs;

public record CreatePropertyDto(
    string Address,
    string City,
    string Type,
    List<CreateUnitDto> Units
);

public record CreateUnitDto(
    string Label,
    decimal MonthlyRent
);

public record PropertyResponseDto(
    Guid Id,
    string Address,
    string City,
    string Type,
    DateTime CreatedAt,
    List<UnitResponseDto> Units
);

public record UnitResponseDto(
    Guid Id,
    string Label,
    decimal MonthlyRent,
    DateTime CreatedAt
);