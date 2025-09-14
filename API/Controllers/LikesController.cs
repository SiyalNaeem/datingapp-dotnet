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
    public class LikesController(ILikesRepository likesRepository) : BaseApiController
    {
        [HttpPost("{targetMemberId}")]
        public async Task<ActionResult> ToggleLike(string targetMemberId)
        {
            var sourceMemberId = User.GetMemberId();
            if (sourceMemberId == targetMemberId) return BadRequest("You cannot like yourself.");

            var existingLike = await likesRepository.GetMemberLike(sourceMemberId, targetMemberId);
            if (existingLike != null)
            {
                likesRepository.DeleteLike(existingLike);
            }
            else
            {
                var like = new MemberLike
                {
                    SourceMemberId = sourceMemberId,
                    TargetMemberId = targetMemberId
                };
                likesRepository.AddLike(like);
            }
            if (await likesRepository.SaveAllAsync()) return Ok();
            return BadRequest("Failed to update like");
        }

        [HttpGet("list")]
        public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
        {
            var memberId = User.GetMemberId();
            var likeIds = await likesRepository.GetCurrentMemberLikeIds(memberId);
            return Ok(likeIds);
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<Member>>> GetMemberLikes([FromQuery] LikeParams likeParams)
        {
            likeParams.MemberId = User.GetMemberId();
            var members = await likesRepository.GetMemberLikes(likeParams);
            return Ok(members);
        }
    }
}
