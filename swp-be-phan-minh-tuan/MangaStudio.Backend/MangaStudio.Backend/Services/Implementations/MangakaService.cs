using Microsoft.EntityFrameworkCore;
using MangaStudio.Backend.Data;
using MangaStudio.Backend.Models.DTOs;
using MangaStudio.Backend.Models.Entities;
using MangaStudio.Backend.Services.Interfaces;

namespace MangaStudio.Backend.Services.Implementations;

public class MangakaService : IMangakaService
{
    private readonly AppDbContext _context;

    public MangakaService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsDto> GetDashboardStats(Guid mangakaId)
    {
        int totalSeries = await _context.MangaSeries
            .CountAsync(x => x.MangakaId == mangakaId);

        int totalAssistants = await _context.Users
            .CountAsync(x =>
                x.Role == "Assistant" &&
                x.ManagerId == mangakaId
            );

        return new DashboardStatsDto
        {
            TotalSeries = totalSeries,
            TotalAssistants = totalAssistants
        };
    }

    public async Task<List<MangaSeriesDto>> GetSeries(Guid mangakaId)
    {
        return await _context.MangaSeries
            .Where(x => x.MangakaId == mangakaId)
            .Select(x => new MangaSeriesDto
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                CoverImageUrl = x.CoverImageUrl
            })
            .ToListAsync();
    }

    public async Task<string> UploadPage(Guid chapterId, IFormFile file)
    {
        string uploadsFolder = Path.Combine(
            Directory.GetCurrentDirectory(),
            "Uploads"
        );

        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        string fileName = Guid.NewGuid()
            + Path.GetExtension(file.FileName);

        string filePath = Path.Combine(
            uploadsFolder,
            fileName
        );

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var mangaPage = new MangaPage
        {
            Id = Guid.NewGuid(),
            ChapterId = chapterId,
            ImageUrl = "/Uploads/" + fileName,
            UploadedAt = DateTime.UtcNow
        };

        _context.MangaPages.Add(mangaPage);

        await _context.SaveChangesAsync();

        return mangaPage.ImageUrl;
    }
}