using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class MessagesController(IUnitOfWork uow) : BaseApiController
    {

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var sender = await uow.MemberRepository.GetMemberByIdAsync(User.GetMemberId());
            var recipient = await uow.MemberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);
            if (recipient == null || sender == null || sender.Id == recipient.Id) return BadRequest("Cannot send message");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                Content = createMessageDto.Content,
                MessageSent = DateTime.UtcNow
            };
            uow.MessagesRepository.AddMessage(message);
            if (await uow.Complete()) return Ok(message.ToDto());

            return BadRequest("Failed to send message");

        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<MessageDto>>> GetMessagesByContainer([FromQuery] MessageParams messageParams)
        {
            messageParams.MemberId = User.GetMemberId();
            return await uow.MessagesRepository.GetMessagesForMember(messageParams);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageThread(string recipientId)
        {
            return Ok(await uow.MessagesRepository.GetMessageThread(User.GetMemberId(), recipientId));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(string id)
        {
            var memberId = User.GetMemberId();
            var message = await uow.MessagesRepository.GetMessage(id);
            if (message == null) return BadRequest("Cannot delete message");

            if (message.SenderId != memberId && message.RecipientId != memberId)
                return BadRequest("You cannot delete message");

            if (message.SenderId == memberId) message.SenderDeleted = true;
            if (message.RecipientId == memberId) message.RecipientDeleted = true;

            if (message is { SenderDeleted: true, RecipientDeleted: true })
                uow.MessagesRepository.DeleteMessage(message);

            if (await uow.Complete())
                return Ok();

            return BadRequest("Problem deleting the message");
        }

    }
}
