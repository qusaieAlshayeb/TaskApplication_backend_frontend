using System.ComponentModel.DataAnnotations;

namespace TaskApplication.Model
{
    public class UpdateUserDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Gender { get; set; }

        public string AboutMe { get; set; }
    }
}

