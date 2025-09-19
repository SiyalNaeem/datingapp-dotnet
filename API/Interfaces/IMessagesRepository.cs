using System;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IMessagesRepository
{
    void AddMessage(Message message);
    void DeleteMessage(Message message);
    Task<Message?> GetMessage(string id);
    Task<PaginatedResult<MessageDto>> GetMessagesForMember(MessageParams messageParams);
    Task<IEnumerable<MessageDto>> GetMessageThread(string currentMemberId, string recipientId);
    Task<bool> SaveAllAsync();

    void AddGroup(Group group);
    Task RemoveConnection(Connection connection);
    Task<Connection?> GetConnection(string connectionId);
    Task<Group?> GetMessageGroup(string groupName);
    Task<Group?> GetGroupForConnection(string connectionId);

}
