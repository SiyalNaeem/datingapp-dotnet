using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MessageRepository(AppDbContext context) : IMessagesRepository
{
    public void AddMessage(Message message)
    {
        context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        context.Messages.Remove(message);
    }

    public async Task<Message?> GetMessage(string id)
    {
        return await context.Messages.FindAsync(id);
    }

    // MessageParams messageParams
    public async Task<PaginatedResult<MessageDto>> GetMessagesForMember(MessageParams messageParams)
    {
        var query = context.Messages.OrderByDescending(x => x.MessageSent).AsQueryable();

        query = messageParams.Container switch
        {
            "Outbox" => query.Where(m => m.SenderId == messageParams.MemberId && !m.SenderDeleted),
            _ => query.Where(m => m.RecipientId == messageParams.MemberId && !m.RecipientDeleted),
        };

        var messages = query.Select(MessageExtensions.ToDtoProjection());

        return await PaginationHelper.CreateAsync<MessageDto>(messages, messageParams.PageNumber, messageParams.PageSize);
    }

    public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentMemberId, string recipientId)
    {
        await context.Messages.Where(m => m.RecipientId == currentMemberId && m.SenderId == recipientId && m.DateRead == null)
            .ExecuteUpdateAsync(setters => setters.SetProperty(m => m.DateRead, DateTime.UtcNow));

        return await context.Messages.Where(x => (x.RecipientId == currentMemberId && !x.RecipientDeleted && x.SenderId == recipientId)
            || (x.SenderId == currentMemberId && !x.SenderDeleted && x.RecipientId == recipientId))
            .OrderBy(x => x.MessageSent)
            .Select(MessageExtensions.ToDtoProjection()).ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
