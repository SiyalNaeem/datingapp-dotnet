using System;
using API.Extensions;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize(AuthenticationSchemes = "Bearer")]
public class PresenceHub(PresenceTracker presenceTracker) : Hub
{

    public override async Task OnConnectedAsync()
    {
        await presenceTracker.UserConnected(GetUserId(), Context.ConnectionId);

        await Clients.Others
            .SendAsync("UserOnline", GetUserId());

        var currentUsers = await presenceTracker.GetOnlineUsers();
        await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await presenceTracker.UserDisconnected(GetUserId(), Context.ConnectionId);
        await Clients.Others.SendAsync("UserOffline", GetUserId());
        var currentUsers = await presenceTracker.GetOnlineUsers();
        await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
        await base.OnDisconnectedAsync(exception);
    }

    private string GetUserId() =>
        Context.User?.GetMemberId() ?? throw new InvalidOperationException("User not found in presence hub");

}
