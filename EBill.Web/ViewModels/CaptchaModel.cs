using EBills.Infrastructure.Models;
using FluentValidation;
using FluentValidation.Attributes;

namespace EBills.Web.ViewModels
{
    [Validator(typeof(CaptchaViewModelValidator))]
    public class CaptchaModel : AppModel
    {
        public string Captcha { get; set; }
    }
    public class CaptchaViewModelValidator : AbstractValidator<CaptchaModel>
    {
        public CaptchaViewModelValidator()
        {
            RuleFor(x => x.Captcha).NotEmpty().WithMessage("Колку е износот?");
        }
    }
}