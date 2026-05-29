using Microsoft.EntityFrameworkCore;
using MangaStudio.Backend.Models.Entities;

namespace MangaStudio.Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    public DbSet<MangaSeries> MangaSeries { get; set; }

    public DbSet<MangaPage> MangaPages { get; set; }
}