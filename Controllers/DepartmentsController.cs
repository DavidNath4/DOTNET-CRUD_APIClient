using Microsoft.AspNetCore.Mvc;

namespace ClientWebApplication.Controllers
{
    public class DepartmentsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
