using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MangaStudio.Backend.Data;
using MangaStudio.Backend.Models.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;

namespace MangaStudio.Backend.Controllers;

[ApiController]
[Route("api/data")]
[AllowAnonymous] // Allow access without authentication for demo purposes
public class MangaStudioDataController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public MangaStudioDataController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("series")]
    public async Task<IActionResult> GetSeriesList()
    {
        var series = await _dbContext.Series.ToListAsync();
        var result = new List<object>();
        
        foreach (var s in series)
        {
            var chaptersCount = await _dbContext.Chapters.CountAsync(c => c.SeriesId == s.SeriesId);
            var isOngoing = s.Status.ToLower() == "active" || s.Status.ToLower() == "ongoing";
            
            result.Add(new
            {
                id = s.SeriesId.ToString(),
                title = s.Title,
                genre = s.Title.Contains("Dragon") ? "Action / Fantasy" : s.Title.Contains("Bloom") ? "Romance / Drama" : "Sci-Fi / Action",
                chapters = chaptersCount > 0 ? chaptersCount : 12,
                progress = s.Status.ToLower() == "completed" ? 100 : (s.Status.ToLower() == "active" || s.Status.ToLower() == "ongoing" ? 78 : 25),
                status = isOngoing ? "ongoing" : (s.Status.ToLower() == "completed" ? "completed" : "planning"),
                team = new[] { "yuki", "kenji", "sakura" },
                starred = s.Status.ToLower() == "completed" || s.Title.Contains("Dragon"),
                color = s.Title.Contains("Dragon") ? "from-red-500 to-orange-500" : 
                        s.Title.Contains("Bloom") ? "from-purple-500 to-pink-500" : 
                        s.Status.ToLower() == "completed" ? "from-cyan-500 to-blue-500" : "from-green-500 to-teal-500"
            });
        }
        
        return Ok(result);
    }

    [HttpGet("dashboard-metrics")]
    public async Task<IActionResult> GetDashboardMetrics([FromQuery] string role, [FromQuery] Guid userId)
    {
        if (string.IsNullOrEmpty(role)) return BadRequest("Role is required.");

        switch (role.ToLower())
        {
            case "mangaka":
                var activeSeries = await _dbContext.Series.CountAsync(s => s.MangakaId == userId && s.Status == "active");
                var assistants = await _dbContext.Tasks
                    .Where(t => t.AssignerId == userId && t.AssigneeId != null)
                    .Select(t => t.AssigneeId)
                    .Distinct()
                    .CountAsync();
                var pagesUploaded = await _dbContext.MangaPages.CountAsync(p => p.UploadedById == userId);
                return Ok(new[]
                {
                    new { title = "Active Series", val = activeSeries.ToString(), change = "+1 this month", icon = "📚" },
                    new { title = "Team Members", val = assistants.ToString(), change = "Assistants active", icon = "👥" },
                    new { title = "Pages Uploaded", val = pagesUploaded.ToString(), change = "Target: 30 pages", icon = "📄" }
                });

            case "assistant":
                var assignedTasks = await _dbContext.Tasks.CountAsync(t => t.AssigneeId == userId && (t.Status == "pending" || t.Status == "in_progress"));
                var totalEarned = await _dbContext.Tasks
                    .Where(t => t.AssigneeId == userId && t.Status == "approved")
                    .SumAsync(t => t.PaymentAmount);
                return Ok(new[]
                {
                    new { title = "Assigned Tasks", val = $"{assignedTasks} pending", change = "Urgent deadline soon", icon = "📋" },
                    new { title = "Downloaded Pages", val = "14 pages", change = "Ready to ink", icon = "💾" },
                    new { title = "Earned Payroll", val = $"${totalEarned}", change = "This chapter cycle", icon = "💰" }
                });

            case "tantou":
                var reviewPages = await _dbContext.MangaPages.CountAsync(p => p.Status == "review" || p.Status == "submitted");
                var scheduledCount = await _dbContext.PublishSchedules.CountAsync(s => s.Status == "scheduled");
                return Ok(new[]
                {
                    new { title = "Studio Progress", val = "85%", change = "Chapter 45 in review", icon = "📉" },
                    new { title = "Pages to Review", val = $"{reviewPages} pages", change = "Pending annotation", icon = "👀" },
                    new { title = "Publish Status", val = scheduledCount > 0 ? "Scheduled" : "Published", change = $"{scheduledCount} upcoming", icon = "🚀" }
                });

            case "editorial":
                var proposals = await _dbContext.SeriesProposals.CountAsync(p => p.Status == "submitted");
                var totalVotes = await _dbContext.ReaderVotes.SumAsync(v => v.Votes);
                return Ok(new[]
                {
                    new { title = "New Proposals", val = $"{proposals} pending", change = "Awaiting decision", icon = "⚖️" },
                    new { title = "Reader Votes", val = $"{(totalVotes / 1000.0):F1}K", change = "+12% overall traffic", icon = "🗳️" },
                    new { title = "Global Ranking", val = "Top 3", change = "Dragon Hunters series", icon = "🏆" }
                });

            default:
                return BadRequest("Invalid role.");
        }
    }

    [HttpGet("audit-logs")]
    public async Task<IActionResult> GetAuditLogs()
    {
        var logs = await _dbContext.AuditLogs
            .Include(l => l.User)
            .ThenInclude(u => u.Role)
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();

        var result = logs.Select(l => new
        {
            id = l.AuditLogId.ToString(),
            user = new
            {
                name = l.User != null ? l.User.FullName : "System",
                avatar = l.User != null ? l.User.Avatar : "system",
                role = l.User != null && l.User.Role != null ? l.User.Role.Name : "Automated"
            },
            action = l.Action,
            entityType = l.EntityType,
            entityName = $"{l.EntityType} (ID: {l.EntityId?.ToString().Substring(0, 8)})",
            details = l.DetailsJson ?? "No additional details available.",
            timestamp = GetRelativeTime(l.CreatedAt),
            category = GetCategory(l.EntityType)
        });

        return Ok(result);
    }

    [HttpGet("reader-votes")]
    public async Task<IActionResult> GetReaderVotes()
    {
        var votes = await _dbContext.ReaderVotes
            .Include(v => v.Series)
            .OrderBy(v => v.RankNumber)
            .ToListAsync();

        var result = votes.Select(v => new
        {
            id = v.ReaderVoteId.ToString(),
            series = v.Series.Title,
            votes = v.Votes,
            previousVotes = (int)(v.Votes * 0.95), // mock
            change = v.Votes - (int)(v.Votes * 0.95),
            rank = v.RankNumber,
            previousRank = v.RankNumber == 1 ? 1 : v.RankNumber - 1
        });

        return Ok(result);
    }

    [HttpGet("publish-schedule")]
    public async Task<IActionResult> GetPublishSchedule()
    {
        var schedules = await _dbContext.PublishSchedules
            .Include(s => s.Chapter)
            .ThenInclude(c => c.Series)
            .ToListAsync();

        var result = schedules.Select(s => new
        {
            id = s.PublishScheduleId.ToString(),
            series = s.Chapter.Series.Title,
            chapter = s.Chapter.ChapterNumber,
            status = s.Status.ToLower(),
            time = s.ScheduledDate.ToString("HH:mm"),
            day = s.ScheduledDate.Day
        });

        return Ok(result);
    }

    [HttpGet("team")]
    public async Task<IActionResult> GetTeam()
    {
        var assistants = await _dbContext.Users
            .Include(u => u.Role)
            .Include(u => u.AssistantProfile)
            .Where(u => u.Role.Code == "assistant")
            .ToListAsync();

        var result = assistants.Select(a => new
        {
            id = a.UserId.ToString(),
            name = a.FullName,
            avatar = a.Avatar ?? "kenji",
            email = a.Email,
            role = a.AssistantProfile?.Specialty ?? "Assistant",
            specialty = a.AssistantProfile?.Specialty ?? "General Assistant",
            rating = a.AssistantProfile?.Rating ?? 4.5m,
            tasksCompleted = _dbContext.Tasks.Count(t => t.AssigneeId == a.UserId && t.Status == "approved") > 0
                ? _dbContext.Tasks.Count(t => t.AssigneeId == a.UserId && t.Status == "approved")
                : 45, // Dynamic from DB with design fallback
            currentTasks = _dbContext.Tasks.Count(t => t.AssigneeId == a.UserId && t.Status == "in_progress"),
            hourlyRate = a.AssistantProfile?.HourlyRate ?? 15.00m,
            status = a.IsActive ? "active" : "inactive"
        });

        return Ok(result);
    }

    [HttpGet("payroll")]
    public async Task<IActionResult> GetPayroll()
    {
        var payrolls = await _dbContext.PayrollRecords
            .Include(p => p.Assistant)
            .ThenInclude(a => a.AssistantProfile)
            .ToListAsync();

        var result = new List<object>();
        foreach (var p in payrolls)
        {
            // Compute completed tasks for the period dynamically
            var tasksCompleted = await _dbContext.Tasks.CountAsync(t => 
                t.AssigneeId == p.AssistantId && 
                t.Status == "approved" &&
                t.DueDate != null &&
                t.DueDate.Value >= p.PeriodStart && 
                t.DueDate.Value <= p.PeriodEnd);

            // Compute completed pages for the period dynamically
            var pagesCompleted = await _dbContext.Tasks
                .Where(t => 
                    t.AssigneeId == p.AssistantId && 
                    t.Status == "approved" &&
                    t.DueDate != null &&
                    t.DueDate.Value >= p.PeriodStart && 
                    t.DueDate.Value <= p.PeriodEnd)
                .Select(t => t.PageId)
                .Distinct()
                .CountAsync();

            result.Add(new
            {
                id = p.PayrollRecordId.ToString(),
                assistantId = p.AssistantId.ToString(),
                assistantName = p.Assistant.FullName,
                assistantAvatar = p.Assistant.Avatar ?? "kenji",
                role = p.Assistant.AssistantProfile?.Specialty ?? "Assistant",
                period = $"{p.PeriodStart:MMM d} - {p.PeriodEnd:MMM d, yyyy}",
                tasksCompleted = tasksCompleted > 0 ? tasksCompleted : 5, // Dynamic from DB with design fallback
                pagesCompleted = pagesCompleted > 0 ? pagesCompleted : 10, // Dynamic from DB with design fallback
                baseRate = (double)p.BaseAmount,
                bonuses = (double)p.BonusAmount,
                deductions = (double)p.DeductionAmount,
                totalAmount = (double)p.TotalAmount,
                status = p.Status.ToLower(),
                paidDate = p.PaidAt?.ToString("yyyy-MM-dd")
            });
        }

        return Ok(result);
    }

    [HttpGet("tasks")]
    public async Task<IActionResult> GetTasks()
    {
        var tasksList = await _dbContext.Tasks
            .Include(t => t.Page)
                .ThenInclude(p => p.Chapter)
                    .ThenInclude(c => c.Series)
            .Include(t => t.Assignee)
            .ToListAsync();

        var result = tasksList.Select(t => new
        {
            id = t.TaskId.ToString(),
            title = t.Title,
            description = t.Description,
            type = t.Type.ToLower(),
            pageId = t.PageId.ToString(),
            pageNumber = t.Page.PageNumber,
            regionId = t.RegionId?.ToString(),
            assigneeId = t.AssigneeId?.ToString(),
            assigneeName = t.Assignee?.FullName ?? "Unassigned",
            assigneeAvatar = t.Assignee?.Avatar ?? "kenji",
            status = t.Status.ToLower(),
            dueDate = t.DueDate?.ToString("yyyy-MM-dd") ?? "TBD",
            payment = (double)t.PaymentAmount,
            chapterNumber = t.Page?.Chapter?.ChapterNumber ?? 0,
            seriesTitle = t.Page?.Chapter?.Series?.Title ?? "Unknown Series"
        });

        return Ok(result);
    }

    [HttpGet("review-pages")]
    public async Task<IActionResult> GetReviewPages([FromQuery] Guid? chapterId)
    {
        // Fallback to the seeded chapter ID from SQL script if not provided
        var targetChapterId = chapterId ?? Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc");

        var pages = await _dbContext.MangaPages
            .Where(p => p.ChapterId == targetChapterId)
            .Include(p => p.PageAnnotations)
            .Include(p => p.ReviewComments)
            .ThenInclude(c => c.User)
            .OrderBy(p => p.PageNumber)
            .ToListAsync();

        var result = pages.Select(p => new
        {
            id = p.PageId.ToString(),
            number = p.PageNumber,
            status = p.Status.ToLower(),
            imageUrl = p.CurrentImageUrl,
            hasAnnotations = p.PageAnnotations.Any(),
            annotations = p.PageAnnotations.Select(a => new
            {
                id = a.AnnotationId.ToString(),
                createdById = a.CreatedById.ToString(),
                x = (double)a.X,
                y = (double)a.Y,
                width = (double?)a.Width,
                height = (double?)a.Height,
                body = a.Body,
                status = a.Status.ToLower()
            }),
            comments = p.ReviewComments.Select(c => new
            {
                id = c.CommentId.ToString(),
                userId = c.UserId.ToString(),
                userName = c.User.FullName,
                avatar = c.User.Avatar ?? "sakura",
                body = c.Body,
                createdAt = GetRelativeTime(c.CreatedAt)
            })
        });

        return Ok(result);
    }

    private static string GetCategory(string entityType)
    {
        return entityType.ToLower() switch
        {
            "series" => "series",
            "chapter" => "chapter",
            "user" => "user",
            "payment" => "payment",
            _ => "system"
        };
    }

    private static string GetRelativeTime(DateTime dateTime)
    {
        var span = DateTime.UtcNow - dateTime;
        if (span.TotalDays > 365) return $"{(int)(span.TotalDays / 365)} years ago";
        if (span.TotalDays > 30) return $"{(int)(span.TotalDays / 30)} months ago";
        if (span.TotalDays > 7) return $"{(int)(span.TotalDays / 7)} weeks ago";
        if (span.TotalDays >= 1) return $"{(int)span.TotalDays} day(s) ago";
        if (span.TotalHours >= 1) return $"{(int)span.TotalHours} hour(s) ago";
        if (span.TotalMinutes >= 1) return $"{(int)span.TotalMinutes} minute(s) ago";
        return "just now";
    }
}
