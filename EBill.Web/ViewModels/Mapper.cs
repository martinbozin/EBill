using System;
 
using EBills.Domain;
using EBills.Web.Areas.Administration.Models;
using System.Linq;
using System.Collections.Generic;
using Martin.ResourcesCommon;


namespace EBills.Web.ViewModels
{
    public static partial class Mapper
    {
        #region Language

        public static LookupViewModel MapToLookupViewModel(this Language model)
        {
            var viewModel = new LookupViewModel();
            viewModel.Value = model.Id;
            viewModel.Text = model.Title;
            return viewModel;
        }

        #endregion
 

        #region User

        public static LookupViewModel MapToLookupViewModel(this User model)
        {
            var viewModel = new LookupViewModel();
            viewModel.Value = model.Id;

            //ke ja vrati na tekovniot jazik na najaveniot korisnik
            viewModel.Text = ResourceManager.GetMultilangValue(model.UserName);

            //var externalInstitution = model as ExternalInstitution;
            //if (externalInstitution != null)
            //{
            //    viewModel.AdditionalInfo = externalInstitution.AllMunicipalities.ToString().ToLower();
            //}

            return viewModel;
        }


        public static UsersGridModel MapToViewModel(this User model)
        {
            var viewModel = new UsersGridModel()
                {
                    Id = model.Id,
                    UserName = model.UserName,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    IsActive = model.IsActive,
                    PreferedLanguage = model.PreferedLanguage.Id,
                    PreferedLanguageName = model.PreferedLanguage.Title,
 
                };

            return viewModel;
        }

        #endregion



        #region User
 

        #endregion



        #region ApplicationParameter

        public static ApplicationParameterViewModel MapToViewModel(this ApplicationParameter model)
        {
            var viewModel = new ApplicationParameterViewModel();
            viewModel.Id = model.Id;
            viewModel.ParameterName = model.ParameterName;
            viewModel.ParameterType = model.ParameterType;
            viewModel.ParameterValue = model.ParameterValue;
            viewModel.ParameterValidUntil = model.ParameterValidUntil;
            viewModel.ParameterValidFrom = model.ParameterValidFrom;
            viewModel.ParameterDescription = model.ParameterDescription;

            return viewModel;
        }

        #endregion


    }
}