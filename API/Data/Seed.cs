using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{

    public static async Task SeedUsers(UserManager<AppUser> userManager)
    {
        if (await userManager.Users.AnyAsync()) return;

        var memberData = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var members = JsonSerializer.Deserialize<List<SeedUserDto>>(memberData);

        if (members == null)
        {
            Console.WriteLine("No user data found to seed.");
            return;
        }


        foreach (var member in members)
        {

            var user = new AppUser
            {
                Id = member.Id,
                DisplayName = member.DisplayName,
                Email = member.Email,
                ImageUrl = member.ImageUrl,
                UserName = member.Email,
                Member = new Member
                {
                    Id = member.Id,
                    DateOfBirth = member.DateOfBirth,
                    DisplayName = member.DisplayName,
                    Created = member.Created,
                    LastActive = member.LastActive,
                    Gender = member.Gender,
                    Description = member.Description,
                    City = member.City,
                    Country = member.Country,
                    ImageUrl = member.ImageUrl,
                }
            };


            user.Member.Photos.Add(new Photo
            {
                Url = member.ImageUrl!,
                IsMain = true,
                PublicId = "seed_photos",
                MemberId = member.Id
            });

            var results = await userManager.CreateAsync(user, "Pa$$w0rd");
            if (!results.Succeeded)
            {
                var errors = string.Join(", ", results.Errors.First().Description);
                Console.WriteLine($"Failed to create user {user.UserName}: {errors}");
            }

            await userManager.AddToRoleAsync(user, "Member");
        }

        var admin = new AppUser
        {
            DisplayName = "Admin",
            Email = "admin@test.com",
            UserName = "admin@test.com",
        };
        
        await userManager.CreateAsync(admin, "Pa$$w0rd");
        await userManager.AddToRolesAsync(admin, ["Admin", "Moderator"]);

    }

}
