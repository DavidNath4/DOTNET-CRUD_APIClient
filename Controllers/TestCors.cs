using Microsoft.AspNetCore.Mvc;

namespace ClientWebApplication.Controllers
{
    public class TestCors : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
