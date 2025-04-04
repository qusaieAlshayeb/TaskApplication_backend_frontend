using Microsoft.AspNetCore.Identity;

namespace TaskApplication.Model
{
    public class User : IdentityUser
    {
        public string? Name { get; set; }

        public string? gender { get; set; }

        public string? AboutMe { get; set; }
    }
}
