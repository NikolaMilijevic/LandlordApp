using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LandlordApi.Controllers;

public abstract class BaseController : ControllerBase
{
    protected string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? throw new UnauthorizedAccessException("No user ID found in token");
    }
}