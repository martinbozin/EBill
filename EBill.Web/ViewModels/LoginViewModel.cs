using EBills.Infrastructure.Models;
using FluentValidation;
using FluentValidation.Attributes;


namespace EBills.Web.ViewModels
{
    public class LoginViewModelValidator : AbstractValidator<LoginViewModel>
    {
        public LoginViewModelValidator()
        {
            RuleFor(u => u.Username)
                .NotEmpty()
                .WithMessage("Внесете корисничко име.");

            RuleFor(u => u.Password)
                .NotEmpty()
                .WithMessage("Внесете лозинка.");
        }
    }

    [Validator(typeof(LoginViewModelValidator))]
    public class LoginViewModel : AppModel
    {
        public string Username { get; set; }

        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }
}