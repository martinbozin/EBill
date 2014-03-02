using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using eDozvoli.Domain;
using eDozvoli.Domain.Data;
using eDozvoli.Infrastructure.MVC.Controllers;
using eDozvoli.Web.ViewModels;

namespace eDozvoli.Web.Controllers
{
    public class ArtistController : AppControllerBase
    {        
       private readonly IArtistRepository _repository;
       public ArtistController(IArtistRepository repository)
        {
            _repository = repository;
        }

        //
        // GET: /Arist/

        public ActionResult Index()
        {
           //Artist m = new Artist("the killers");
           //_repository.AddArtist(m);
            return View();
        }
        [HttpGet]
        public ActionResult Edit(int id)
        {
          var model1=_repository.GetSpecificArtist(id);
            ArtistViewModel model = new ArtistViewModel();
            model.ArtistId = model1.ArtistId;
            model.Name = model1.Name;
            return View(model);
        }
        [HttpPost]
        public ActionResult Edit(ArtistViewModel artist)
        {
            Artist m = new Artist();
            m.ArtistId = artist.ArtistId;
          
            _repository.SaveOrUpdate(m);
            return RedirectToAction("Index");
        }

    }
}
