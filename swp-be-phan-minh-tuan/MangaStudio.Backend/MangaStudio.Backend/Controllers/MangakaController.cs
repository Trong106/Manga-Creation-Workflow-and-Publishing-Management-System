using Microsoft.AspNetCore.Mvc;
using MangaStudio.Backend.Services.Interfaces;

namespace MangaStudio.Backend.Controllers;

[ApiController]
[Route("api/mangaka")] 
public class MangakaController : ControllerBase 
{ 
    private readonly IMangakaService _mangakaService; 
    public MangakaController(IMangakaService mangakaService)
    { _mangakaService = mangakaService; }

    [HttpGet("dashboard-stats/{mangakaId}")]
    public async Task<IActionResult> GetDashboardStats(Guid mangakaId)
    {
        var result = await _mangakaService.GetDashboardStats(mangakaId);
        return Ok(result);
    }
    [HttpGet("series")]
    public async Task<IActionResult> GetSeries(Guid mangakaId)
    { 
        var result = await _mangakaService.GetSeries(mangakaId);
        return Ok(result);
    }
    [HttpPost("chapters/{id}/upload-pages")]
    public async Task<IActionResult> UploadPage(Guid id, IFormFile file)
    { 
        var result = await _mangakaService.UploadPage(id, file);
        return Ok(result);
    }
}
