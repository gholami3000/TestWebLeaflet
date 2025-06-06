﻿using Microsoft.EntityFrameworkCore;

namespace TestWebLeaflet.Models;

//public class AppDbContext : DbContext
//{
//    public DbSet<Location> Location { get; set; }

//    protected override void OnConfiguring(DbContextOptionsBuilder options)
//    {
//        //options.UseSqlite("Data Source=app.db"); // SQLite در فایل app.db ذخیره می‌شود

//        // مسیر به پوشه App_Data در کنار پروژه
//        var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "App_Data", "app.db");
//        options.UseSqlite($"Data Source={dbPath}");
//    }
//}

public class AppDbContext : DbContext
{
    public DbSet<Location> Location { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}

