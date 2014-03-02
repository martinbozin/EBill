using EBills.Infrastructure.Models;
using FluentValidation;
using FluentValidation.Attributes;

namespace EBills.Web.ViewModels
{
    [Validator(typeof(RegistrationConfirmationViewModelValidator))]
    public class RegistrationConfirmationViewModel : AppModel
    {
        public string UserName { get; set; }
        public string Code { get; set; }
    }
    public class RegistrationConfirmationViewModelValidator : AbstractValidator<RegistrationConfirmationViewModel>
    {
        public RegistrationConfirmationViewModelValidator()
        {

            RuleFor(x => x.UserName).NotEmpty().WithMessage("Корисничкото име е задолжително."); ;
            RuleFor(x => x.Code).NotEmpty().WithMessage("Кодот е задолжителен."); ;
        }
    }
}