using System;
using System.Threading.Tasks;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikesRepository(AppDbContext context) : ILikesRepository
{
    public void AddLike(MemberLike like)
    {
        context.Likes.Add(like);
    }

    public void DeleteLike(MemberLike like)
    {
        context.Likes.Remove(like);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
    {
        return await context.Likes.Where(l => l.SourceMemberId == memberId).Select(l => l.TargetMemberId).ToListAsync();
    }

    public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
    {
        return await context.Likes.FindAsync(sourceMemberId, targetMemberId);
    }

    public async Task<PaginatedResult<Member>> GetMemberLikes(LikeParams likeParams)
    {
        var query = context.Likes.AsQueryable();
        IQueryable<Member> result;

        switch (likeParams.Predicate)
        {
            case "liked":
                result = query.Where(l => l.SourceMemberId == likeParams.MemberId)
                    .Select(l => l.TargetMember);
                break;
            case "likedBy":
                result = query.Where(l => l.TargetMemberId == likeParams.MemberId)
                    .Select(l => l.SourceMember);
                break;
            default:
                var likeIds = await GetCurrentMemberLikeIds(likeParams.MemberId);
                result = query.Where(l => l.TargetMemberId == likeParams.MemberId && likeIds.Contains(l.SourceMemberId))
                    .Select(l => l.SourceMember);
                break;
        }

        return await PaginationHelper.CreateAsync(result, likeParams.PageNumber, likeParams.PageSize);

    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
