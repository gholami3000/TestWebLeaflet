using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;

namespace TestWebLeaflet;

public class AlarmHub : Hub
{   
    public async Task SendAlarm(Guid id)
    {        
        // Send data to clients
        await Clients.All.SendAsync("ReceiveAlarm",
            id        
        );
    }
}


