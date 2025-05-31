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
            Name = model.Name,
            lat = model.lat,
            lng = model.lng
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

    [HttpPost]
    public async Task<IActionResult> StartAlarm(Guid id)
    {
        //var q=_context.Location.FirstOrDefault();
        // ارسال پیام به همه کلاینت‌ها
        await _hubContext.Clients.All.SendAsync("ReceiveAlarm", "startAlarm", id);
        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> StopAlarm(Guid id)
    {
        //var q=_context.Location.FirstOrDefault();
        // ارسال پیام به همه کلاینت‌ها
        await _hubContext.Clients.All.SendAsync("ReceiveAlarm", "stopAlarm", id);
        return Ok();
    }

    public async Task<IActionResult> GetItem(Guid id)
    {
        var item =await _context.Location.FirstOrDefaultAsync(x => x.Id == id);
        return Ok(item);
    }

    public async Task<IActionResult> RemoveItem(Guid id)
    {
        var item = _context.Location.FirstOrDefault(x => x.Id == id);
        if (item is not null)
        {
            _context.Location.Remove(item);
          await  _context.SaveChangesAsync();
        }
        return Ok(item);
    }


}
