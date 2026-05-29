namespace MangaStudio.Backend.Models.Entities;

public class MangaSeries
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string CoverImageUrl { get; set; } = string.Empty;

    public Guid MangakaId { get; set; }
}