using Microsoft.EntityFrameworkCore;
using TestWebLeaflet;
using TestWebLeaflet.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
//بیس SQLite در پوشه App_Data
var dbFolder = Path.Combine(Directory.GetCurrentDirectory(), "App_Data");
Directory.CreateDirectory(dbFolder); // ساخت پوشه در صورت نبودن
var dbPath = Path.Combine(dbFolder, "app.db");

// از readonly بودن فایل جلوگیری کن
//if (File.Exists(dbPath))
//{
//    var fi = new FileInfo(dbPath);
//    fi.IsReadOnly = false;
//}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}
app.UseStaticFiles();

app.UseRouting();

//app.UseAuthorization();
app.MapHub<AlarmHub>("/AlarmHub");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");


// 🔧 اینجا دیتابیس ایجاد می‌شود اگر وجود نداشته باشد
//using (var scope = app.Services.CreateScope())
//{
//    //var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//    //dbContext.Database.EnsureCreated();

//    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//    dbContext.Database.Migrate();
//}
app.Run();
