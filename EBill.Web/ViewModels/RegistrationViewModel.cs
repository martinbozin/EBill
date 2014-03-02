using EBills.Infrastructure.Models;
using FluentValidation;
using FluentValidation.Attributes;

namespace EBills.Web.ViewModels
{
    [Validator(typeof(RegistrationViewModelValidator))]
    public class RegistrationViewModel : AppModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Address { get; set; }
        public string CaptchaValue { get; set; }

        //Се користат за додатни податоци во емаилот за конфирмација на креиран акаунт
        public virtual string Protocol { get; set; }
        public virtual string ApplicationtRootUrl { get; set; }
        public virtual string RegistrationCode { get; set; }
        public virtual string FullName { get; set; }
    }


    public class RegistrationViewModelValidator : AbstractValidator<RegistrationViewModel>
    {
        public RegistrationViewModelValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty().WithMessage("Името е задолжително.");
            RuleFor(x => x.LastName).NotEmpty().WithMessage("Презимето е задолжително.");
            RuleFor(x => x.UserName).NotEmpty().WithMessage("Корисничкото име е задолжително.");
            RuleFor(x => x.UserName).EmailAddress().WithMessage("Корисничкото име треба да е е-маил адреса.");
            RuleFor(x => x.Password).NotEmpty().WithMessage("Лозинката е задолжителна.");
            RuleFor(x => x.Address).NotEmpty().WithMessage("Адресата е задолжителна.");
            RuleFor(x => x.CaptchaValue).NotEmpty().WithMessage("Внесете ја сумата.");
        }
    }
}