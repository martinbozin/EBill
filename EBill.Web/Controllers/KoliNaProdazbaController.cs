using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using eDozvoli.Domain.Data;
using eDozvoli.Infrastructure.MVC.Controllers;

namespace eDozvoli.Web.Controllers
{
    public class KoliNaProdazbaController : AppControllerBase
    {
        //
        // GET: /KoliNaProdazba/
        private readonly IKoliNaProdazbaRepository _koliNaProdazbaRepository;

        public KoliNaProdazbaController(IKoliNaProdazbaRepository koliNaProdazbaRepository)
        {
            _koliNaProdazbaRepository = koliNaProdazbaRepository;
        }

        public ActionResult Index()
        {
          
            var siteKoli = _koliNaProdazbaRepository.GetAll();

            var nekoiKoli = _koliNaProdazbaRepository.DajMiSkapiKoli();


            return View();
        }

    }
}
