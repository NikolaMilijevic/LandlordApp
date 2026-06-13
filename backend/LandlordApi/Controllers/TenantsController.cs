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
public class TenantsController : BaseController
{
    private readonly AppDbContext _db;

    public TenantsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = GetUserId();

        var tenant = await _db.Tenants
            .Include(t => t.Unit)
                .ThenInclude(u => u.Property)
            .FirstOrDefaultAsync(t =>
                t.Id == id && t.Unit.Property.ClerkUserId == userId);

        if (tenant == null) return NotFound();

        var response = new TenantResponseDto(
            tenant.Id,
            tenant.UnitId,
            tenant.Name,
            tenant.Email,
            tenant.Phone,
            tenant.LeaseStart,
            tenant.LeaseEnd,
            tenant.Deposit,
            tenant.RentDueDay,
            tenant.CreatedAt
        );

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTenantDto dto)
    {
        var userId = GetUserId();

        var unit = await _db.Units
            .Include(u => u.Property)
            .FirstOrDefaultAsync(u =>
                u.Id == dto.UnitId && u.Property.ClerkUserId == userId);

        if (unit == null) return NotFound("Unit not found");

        var tenant = new Tenant
        {
            Id = Guid.NewGuid(),
            UnitId = dto.UnitId,
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            LeaseStart = dto.LeaseStart,
            LeaseEnd = dto.LeaseEnd,
            Deposit = dto.Deposit,
            RentDueDay = dto.RentDueDay,
            CreatedAt = DateTime.UtcNow
        };

        _db.Tenants.Add(tenant);
        await _db.SaveChangesAsync();

        var response = new TenantResponseDto(
            tenant.Id,
            tenant.UnitId,
            tenant.Name,
            tenant.Email,
            tenant.Phone,
            tenant.LeaseStart,
            tenant.LeaseEnd,
            tenant.Deposit,
            tenant.RentDueDay,
            tenant.CreatedAt
        );

        return CreatedAtAction(nameof(GetById), new { id = tenant.Id }, response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTenantDto dto)
    {
        var userId = GetUserId();

        var tenant = await _db.Tenants
            .Include(t => t.Unit)
                .ThenInclude(u => u.Property)
            .FirstOrDefaultAsync(t =>
                t.Id == id && t.Unit.Property.ClerkUserId == userId);

        if (tenant == null) return NotFound();

        tenant.Name = dto.Name;
        tenant.Email = dto.Email;
        tenant.Phone = dto.Phone;
        tenant.LeaseStart = dto.LeaseStart;
        tenant.LeaseEnd = dto.LeaseEnd;
        tenant.Deposit = dto.Deposit;
        tenant.RentDueDay = dto.RentDueDay;

        await _db.SaveChangesAsync();

        var response = new TenantResponseDto(
            tenant.Id,
            tenant.UnitId,
            tenant.Name,
            tenant.Email,
            tenant.Phone,
            tenant.LeaseStart,
            tenant.LeaseEnd,
            tenant.Deposit,
            tenant.RentDueDay,
            tenant.CreatedAt
        );

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();

        var tenant = await _db.Tenants
            .Include(t => t.Unit)
                .ThenInclude(u => u.Property)
            .FirstOrDefaultAsync(t =>
                t.Id == id && t.Unit.Property.ClerkUserId == userId);

        if (tenant == null) return NotFound();

        _db.Tenants.Remove(tenant);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}