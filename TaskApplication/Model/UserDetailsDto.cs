namespace TaskApplication.Model
{
    public class UserDetailsDto
    {
        public string Id { get; set; } // Add this

        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Gender { get; set; }
        public string? AboutMe { get; set; }
    }
}
