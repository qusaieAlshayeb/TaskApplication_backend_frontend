using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TaskApplication.Model;

namespace TaskApplication.DataBase
{
    public class DbContextApi : IdentityDbContext<User>
    {
        public DbContextApi(DbContextOptions<DbContextApi> options ) : base(options)
        {

        }

     

    }
}
