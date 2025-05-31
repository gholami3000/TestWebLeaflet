using System;

namespace TestWebLeaflet.Models;



public class Location
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public double lat { get; set; }
    public double lng { get; set; }
}

