using System;

namespace API.Interfaces;

public interface IUnitOfWork
{
    IMemberRepository MemberRepository { get; }
    ILikesRepository LikesRepository { get; }
    IMessagesRepository MessagesRepository { get; }
    Task<bool> Complete();
    bool HasChanges();
}
