using Microsoft.EntityFrameworkCore;
using System;

namespace TestWebLeaflet.Models;

public class AppDbContext : DbContext
{
    public DbSet<Location> Location { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        //options.UseSqlite("Data Source=app.db"); // SQLite در فایل app.db ذخیره می‌شود

        // مسیر به پوشه App_Data در کنار پروژه
        var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "App_Data", "app.db");
        options.UseSqlite($"Data Source={dbPath}");
    }
}



public class Location
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public double lat { get; set; }
    public double lng { get; set; }
}

