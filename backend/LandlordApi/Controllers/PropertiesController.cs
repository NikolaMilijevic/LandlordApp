using LandlordApi.Data;
using LandlordApi.DTOs;
using LandlordApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LandlordApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PropertiesController : BaseController
{
    private readonly AppDbContext _db;

    public PropertiesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();

        var properties = await _db.Properties
            .Where(p => p.ClerkUserId == userId)
            .Include(p => p.Units)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        var response = properties.Select(p => new PropertyResponseDto(
            p.Id,
            p.Address,
            p.City,
            p.Type,
            p.CreatedAt,
            p.Units.Select(u => new UnitResponseDto(
                u.Id,
                u.Label,
                u.MonthlyRent,
                u.CreatedAt,
                new List<TenantResponseDto>()
            )).ToList()
        ));

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = GetUserId();

        var property = await _db.Properties
            .Where(p => p.Id == id && p.ClerkUserId == userId)
            .Include(p => p.Units)
                .ThenInclude(u => u.Tenants)
            .FirstOrDefaultAsync();

        if (property == null) return NotFound();

        var response = new PropertyResponseDto(
            property.Id,
            property.Address,
            property.City,
            property.Type,
            property.CreatedAt,
            property.Units.Select(u => new UnitResponseDto(
                u.Id,
                u.Label,
                u.MonthlyRent,
                u.CreatedAt,
                u.Tenants?.Select(t => new TenantResponseDto(
                    t.Id,
                    t.UnitId,
                    t.Name,
                    t.Email,
                    t.Phone,
                    t.LeaseStart,
                    t.LeaseEnd,
                    t.Deposit,
                    t.RentDueDay,
                    t.CreatedAt
                )).ToList() ?? new List<TenantResponseDto>()
            )).ToList()
        );

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePropertyDto dto)
    {
        var userId = GetUserId();

        var property = new RentalProperty
        {
            Id = Guid.NewGuid(),
            ClerkUserId = userId,
            Address = dto.Address,
            City = dto.City,
            Type = dto.Type,
            CreatedAt = DateTime.UtcNow,
            Units = dto.Units.Select(u => new Unit
            {
                Id = Guid.NewGuid(),
                Label = u.Label,
                MonthlyRent = u.MonthlyRent,
                CreatedAt = DateTime.UtcNow
            }).ToList()
        };

        _db.Properties.Add(property);
        await _db.SaveChangesAsync();

        var response = new PropertyResponseDto(
            property.Id,
            property.Address,
            property.City,
            property.Type,
            property.CreatedAt,
            property.Units.Select(u => new UnitResponseDto(
                u.Id,
                u.Label,
                u.MonthlyRent,
                u.CreatedAt,
                new List<TenantResponseDto>()
            )).ToList()
        );

        return CreatedAtAction(nameof(GetById), new { id = property.Id }, response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePropertyDto dto)
    {
        var userId = GetUserId();

        var property = await _db.Properties
            .FirstOrDefaultAsync(p => p.Id == id && p.ClerkUserId == userId);

        if (property == null) return NotFound();

        // Update property fields
        property.Address = dto.Address;
        property.City = dto.City;
        property.Type = dto.Type;
        await _db.SaveChangesAsync();

        if (dto.Units != null)
        {
            var existingUnits = await _db.Units
                .Where(u => u.PropertyId == id)
                .ToListAsync();

            var incomingIds = dto.Units
                .Where(u => u.Id.HasValue)
                .Select(u => u.Id!.Value)
                .ToList();

            var unitsToDelete = existingUnits
                .Where(u => !incomingIds.Contains(u.Id))
                .ToList();

            if (unitsToDelete.Any())
            {
                _db.Units.RemoveRange(unitsToDelete);
                await _db.SaveChangesAsync();
            }

            foreach (var unitDto in dto.Units)
            {
                if (unitDto.Id.HasValue)
                {
                    var existing = await _db.Units
                        .FirstOrDefaultAsync(u => u.Id == unitDto.Id.Value && u.PropertyId == id);
                    if (existing != null)
                    {
                        existing.Label = unitDto.Label;
                        existing.MonthlyRent = unitDto.MonthlyRent;
                        await _db.SaveChangesAsync();
                    }
                }
                else
                {
                    var newUnit = new Unit
                    {
                        Id = Guid.NewGuid(),
                        PropertyId = id,
                        Label = unitDto.Label,
                        MonthlyRent = unitDto.MonthlyRent,
                        CreatedAt = DateTime.UtcNow
                    };
                    _db.Units.Add(newUnit);
                    await _db.SaveChangesAsync();
                }
            }
        }

        var updated = await _db.Properties
            .Where(p => p.Id == id)
            .Include(p => p.Units)
            .FirstOrDefaultAsync();

        return Ok(new PropertyResponseDto(
            updated!.Id,
            updated.Address,
            updated.City,
            updated.Type,
            updated.CreatedAt,
            updated.Units.Select(u => new UnitResponseDto(
                u.Id,
                u.Label,
                u.MonthlyRent,
                u.CreatedAt,
                new List<TenantResponseDto>()
            )).ToList()
        ));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();

        var property = await _db.Properties
            .FirstOrDefaultAsync(p => p.Id == id && p.ClerkUserId == userId);

        if (property == null) return NotFound();

        _db.Properties.Remove(property);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}