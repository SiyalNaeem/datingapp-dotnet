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
    public class LikesController(IUnitOfWork uow) : BaseApiController
    {
        [HttpPost("{targetMemberId}")]
        public async Task<ActionResult> ToggleLike(string targetMemberId)
        {
            var sourceMemberId = User.GetMemberId();
            if (sourceMemberId == targetMemberId) return BadRequest("You cannot like yourself.");

            var existingLike = await uow.LikesRepository.GetMemberLike(sourceMemberId, targetMemberId);
            if (existingLike != null)
            {
                uow.LikesRepository.DeleteLike(existingLike);
            }
            else
            {
                var like = new MemberLike
                {
                    SourceMemberId = sourceMemberId,
                    TargetMemberId = targetMemberId
                };
                uow.LikesRepository.AddLike(like);
            }
            if (await uow.Complete()) return Ok();
            return BadRequest("Failed to update like");
        }

        [HttpGet("list")]
        public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
        {
            var memberId = User.GetMemberId();
            var likeIds = await uow.LikesRepository.GetCurrentMemberLikeIds(memberId);
            return Ok(likeIds);
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<Member>>> GetMemberLikes([FromQuery] LikeParams likeParams)
        {
            likeParams.MemberId = User.GetMemberId();
            var members = await uow.LikesRepository.GetMemberLikes(likeParams);
            return Ok(members);
        }
    }
}
