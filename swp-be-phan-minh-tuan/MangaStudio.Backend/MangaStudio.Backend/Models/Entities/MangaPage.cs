namespace MangaStudio.Backend.Models.Entities;

public class MangaPage
{
    public Guid Id { get; set; }

    public Guid ChapterId { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public DateTime UploadedAt { get; set; }
}