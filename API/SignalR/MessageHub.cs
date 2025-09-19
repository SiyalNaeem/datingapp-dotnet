using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize(AuthenticationSchemes = "Bearer")]
public class MessageHub(
    IMessagesRepository messagesRepository,
    IMemberRepository memberRepository,
    IHubContext<PresenceHub> presenceHub
    ) : Hub
{
    public override async Task OnConnectedAsync()
    {
        var http = Context.GetHttpContext();
        var otherUser = http?.Request.Query["userId"].ToString() ?? throw new HubException("No user specified");
        var groupName = GetGroupName(GetUserId(), otherUser);

        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        await AddToGroup(groupName);

        var messages = await messagesRepository.GetMessageThread(GetUserId(), otherUser);

        await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
    }

    public async Task SendMessage(CreateMessageDto createMessageDto)
    {
        var sender = await memberRepository.GetMemberByIdAsync(GetUserId());
            var recipient = await memberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);
            if (recipient == null || sender == null || sender.Id == recipient.Id)
                throw new HubException("Cannot send message");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                Content = createMessageDto.Content,
                MessageSent = DateTime.UtcNow
            };

            var groupName = GetGroupName(sender.Id, recipient.Id);
            var group = await messagesRepository.GetMessageGroup(groupName);
            var userInGroup = group?.Connections.Any(x => x.UserId == recipient.Id) ?? false;
            
            if (userInGroup)
            {
                message.DateRead = DateTime.UtcNow;
            }

            messagesRepository.AddMessage(message);
        if (await messagesRepository.SaveAllAsync())
        {
            await Clients.Group(groupName).SendAsync("NewMessage", message.ToDto());
            var connections = await PresenceTracker.GetConnectionsForUser(recipient.Id);
            if (connections != null && connections.Count > 0 && !userInGroup)
            {
                await presenceHub.Clients
                    .Clients(connections).SendAsync("NewMessageReceived", message.ToDto());
            }
            return;
        }

        throw new HubException("Failed to send message");
    }

    private static string GetGroupName(string? caller, string? other) =>
        string.CompareOrdinal(caller, other) < 0 ? $"{caller}-{other}" : $"{other}-{caller}";

    public async Task<bool> AddToGroup(string groupName)
    {
        var group = await messagesRepository.GetMessageGroup(groupName);
        var connection = new Connection(Context.ConnectionId, GetUserId());
        if (group == null)
        {
            group = new Group(groupName);
            messagesRepository.AddGroup(group);
        }

        group.Connections.Add(connection);
        return await messagesRepository.SaveAllAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await messagesRepository.RemoveConnection(new Connection(Context.ConnectionId, GetUserId()));
        await base.OnDisconnectedAsync(exception);
    }
    
    private string GetUserId() =>
        Context.User?.GetMemberId() ?? throw new InvalidOperationException("User not found in presence hub");

}
