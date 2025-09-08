using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";
    [Required]
    public string DisplayName { get; set; } = "";
    [Required]
    [MinLength(6)]
    public string Password { get; set; } = "";
}
