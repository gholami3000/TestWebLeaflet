using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TestWebLeaflet.Models;

namespace TestWebLeaflet.Controllers;

public class HomeController : Controller
{
    private readonly AppDbContext _context;
    private readonly IHubContext<AlarmHub> _hubContext;
    // تزریق DbContext از طریق کانستراکتور
    public HomeController(AppDbContext context, IHubContext<AlarmHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }


    public IActionResult Index()
    {
        return View();
    }
    public IActionResult Index2()
    {
        return View();
    }

    
    public IActionResult ShowAddLocation()
    {
        return View();
    }

    
    [HttpPost]
    public IActionResult AddLocation(Location model)
    {
        // افزودن یک شخص
        _context.Location.Add(new Location
        {
            Name=model.Name,
            lat=model.lat,
            lng=model.lng
        });

        _context.SaveChanges();

        // نمایش داده‌ها
        var location = _context.Location.ToList();
        
        return Json("ok");
    }

    public IActionResult GetLocationList()
    {
        // نمایش داده‌ها
        //var locationList = _context.Location.ToList();
        //foreach (var item in locationList)
        //{
        //    _context.Remove(item);
        //}
        //_context.SaveChanges();

        var locationList = _context.Location.ToList();
        return Json(locationList);
    }

    
    public async Task<IActionResult> SendAlarm()
    {
        var q=_context.Location.FirstOrDefault();
        // ارسال پیام به همه کلاینت‌ها
        await _hubContext.Clients.All.SendAsync("ReceiveAlarm", q.Id);

        return Ok();
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
