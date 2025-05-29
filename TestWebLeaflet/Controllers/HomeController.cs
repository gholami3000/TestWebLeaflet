using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using TestWebLeaflet.Models;

namespace TestWebLeaflet.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }
    public IActionResult Index2()
    {
        return View();
    }

    public IActionResult Index3()
    {
        return View();
    }
    public IActionResult ShowAddLocation()
    {
        return View();
    }

    public IActionResult AddLocation(Location model)
    {

        using var db = new AppDbContext();

        // افزودن یک شخص
        db.Location.Add(new Location { Name = "شعبه1", Id =Guid.NewGuid() });
        db.Location.Add(new Location { Name = "2", Id =Guid.NewGuid() });
        db.SaveChanges();

        // نمایش داده‌ها
        var people = db.Location.ToList();
        foreach (var person in people)
        {
            
        }
        return Json("ok");
    }



    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
