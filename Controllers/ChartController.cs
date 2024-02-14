using Microsoft.AspNetCore.Mvc;

namespace ClientWebApplication.Controllers
{
    public class ChartController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
