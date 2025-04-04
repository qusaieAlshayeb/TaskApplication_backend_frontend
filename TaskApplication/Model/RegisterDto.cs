using Microsoft.AspNetCore.Identity;

namespace TaskApplication.Model
{
    public class RegisterDto
    {
        
        
            public string? Email { get; set; }        // Note PascalCase
            public string? Name { get; set; }         // Changed from 'name' to 'Name'
            public string? Gender { get; set; }       // Changed from 'gender' to 'Gender'
            public string? AboutMe { get; set; }      // Already correct
            public string? Password { get; set; }     // Already correct
        
    }



}

