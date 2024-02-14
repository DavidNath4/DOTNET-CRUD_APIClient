using Microsoft.AspNetCore.Mvc;

namespace ClientWebApplication.Controllers
{
    public class EmployeesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
