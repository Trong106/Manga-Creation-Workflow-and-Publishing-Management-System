namespace MangaStudio.Backend.Models.DTOs;
public class MangaSeriesDto 
{
    public Guid Id { get; set; } 
    public string Title { get; set; }
    public string Description { get; set; }
    public string CoverImageUrl { get; set; }
}