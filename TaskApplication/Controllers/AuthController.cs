using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TaskApplication.Model;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace TaskApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;  // Use UserManager for user management
        private readonly SignInManager<User> _signInManager;  // Use SignInManager for login
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            // Map RegisterDto to user
            var user = new User
            {
                UserName = registerDto.Name,


                Email = registerDto.Email,
                        // Updated to match DTO
                gender = registerDto.Gender,      // Updated to match DTO
                AboutMe = registerDto.AboutMe
            };

            // Create user with the password
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                return Ok(new
                {
                    Message = "User registered successfully!",
                    UserId = user.Id
                });
            }

            // Return more detailed error information
            return BadRequest(new
            {
                Message = "User registration failed",
                Errors = result.Errors.Select(e => e.Description)
            });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // Find user by email using UserManager
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            // Check if password is correct using SignInManager
            var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, false, false);
            if (!result.Succeeded)
            {
                return Unauthorized("Invalid email or password.");
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);

            // Return token and a welcome message
            return Ok(new { message = "Welcome, " + user.Name, token });
        }




        // show list users  
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users
                .Select(user => new UserDetailsDto
                {
                    Id = user.Id, // Add this line
                    Name = user.UserName,
                    Email = user.Email,
                    Gender = user.gender,
                    AboutMe = user.AboutMe
                })
                .ToListAsync();

            return Ok(users);
        }


        //get user by id 
        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            // Log the incoming ID for debugging
            Console.WriteLine($"Received user ID: {id}");

            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("User ID is required.");
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var userDetails = new UserDetailsDto
            {
                Name = user.UserName,
                Email = user.Email,
                Gender = user.gender,
                AboutMe = user.AboutMe
            };

            return Ok(userDetails);
        }


        //update user by id 

        [HttpPut("user/{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto updateUserDto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Update properties
            user.UserName = updateUserDto.Name;
            user.Email = updateUserDto.Email;
            user.gender = updateUserDto.Gender;
            user.AboutMe = updateUserDto.AboutMe;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Return the updated user details
            return Ok(new UserDetailsDto
            {
                Id = user.Id,
                Name = user.UserName,
                Email = user.Email,
                Gender = user.gender,
                AboutMe = user.AboutMe
            });
        }


        //Delete Users

        [HttpDelete("user/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            // Find the user by ID
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Delete the user from the database
            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest("Failed to delete user.");
            }

            return Ok("User deleted successfully.");
        }








        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Get the token from the Authorization header
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new { message = "Invalid token. Token is missing or incorrect." });
            }

            try
            {
                // Invalidate the token client-side (this is how JWT works)
                // The idea is that the client can simply discard the token after this call, and it won't be valid anymore.

                // Return success message
                return Ok(new { message = "You have been successfully logged out." });
            }
            catch (Exception ex)
            {
                // Handle any errors that occur during the process
                return BadRequest(new { message = $"An error occurred during logout: {ex.Message}" });
            }
        }








        [HttpGet("me")]
        public async Task<IActionResult> GetUserFromToken()
        {
            try
            {
                // Get the token from the Authorization header
                var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

                if (string.IsNullOrEmpty(token))
                {
                    return BadRequest(new { message = "Token is missing or invalid." });
                }

                // Decode the token
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

                if (jwtToken == null)
                {
                    return Unauthorized("Invalid token.");
                }

                // Get the user ID from the 'sub' claim (which is the user ID in the JWT)
                var userId = jwtToken?.Claims?.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User ID not found in token.");
                }

                // Find the user by ID using UserManager
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Map the user to UserDetailsDto
                var userDetails = new UserDetailsDto
                {
                    Name = user.UserName,
                    Email = user.Email,
                    Gender = user.gender,
                    AboutMe = user.AboutMe
                };

                return Ok(userDetails);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"An error occurred: {ex.Message}" });
            }
        }






        [HttpGet("validate-token")]
        public IActionResult ValidateToken()
        {
            // The [Authorize] attribute already validates the token
            return Ok(new { message = "Token is valid" });
        }



        // this one for  generate  token 
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(ClaimTypes.Role, "User"), // Consider fetching dynamic roles if applicable
        // Add other claims as needed
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpiryMinutes"])),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
