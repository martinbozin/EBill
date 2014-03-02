using FluentValidation;
using FluentValidation.Attributes;

namespace EBills.Web.ViewModels
{
    //[Validator(typeof(ProfileViewModelValidator))]
    public class ProfileViewModel
    {
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Password { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }

        public string Institution { get; set; }
        public string Certificate { get; set; }
    }

    //public class ProfileViewModelValidator : AbstractValidator<ProfileViewModel>
    //{
    //    public ProfileViewModelValidator()
    //    {
    //        RuleFor(x => x.Password).NotEmpty().WithMessage(Martin.ResourcesCommon.ResourceManager.GetResourceValue("eDozvoli.Web.ViewModels.ProfileViewModel.StaraLozinka")); //Стара лозинка е задолжително поле.
    //        RuleFor(x => x.NewPassword).NotEmpty().WithMessage(Martin.ResourcesCommon.ResourceManager.GetResourceValue("eDozvoli.Web.ViewModels.ProfileViewModel.NovaLozinka")); //"Нова лозинка е задолжително поле."
    //        RuleFor(x => x.ConfirmPassword)
    //            .Equal(x => x.NewPassword)
    //            .WithMessage(Martin.ResourcesCommon.ResourceManager.GetResourceValue("eDozvoli.Web.ViewModels.ProfileViewModel.Nova")) //"Нова лозинка и Потврди нова лозника треба да бидат исти."
    //            .NotEmpty()
    //            .WithMessage(Martin.ResourcesCommon.ResourceManager.GetResourceValue("eDozvoli.Web.ViewModels.ProfileViewModel.PotvrdiLozinka")); //"Потврди нова лозинка е задолжително поле.

    //    }
    //}
}