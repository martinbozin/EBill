using EBills.Infrastructure.Grid;
using FluentValidation;
using FluentValidation.Attributes;

namespace EBills.Web.Areas.Administration.Models
{
    [Validator(typeof(UsersGridModelValidator))]
    public class UsersGridModel : GridItemBase
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsActive { get; set; }
        public string UserName { get; set; }
        public int PreferedLanguage { get; set; }
        public string PreferedLanguageName { get; set; }
        public string Pos { get; set; }
        public int PosId { get; set; }
        //public string Address { get; set; }
    }

    public class UsersGridModelValidator : AbstractValidator<UsersGridModel>
    {
        public UsersGridModelValidator()
        {
            RuleFor(x => x.FirstName)
               .NotEmpty()
               .WithMessage("Името е задолжително.");

            RuleFor(x => x.UserName)
                .NotEmpty()
                .WithMessage("Корисничкото име е задолжително.");

            RuleFor(x => x.LastName)
                .NotEmpty()
                .WithMessage("Презимето е задолжително.");

            RuleFor(x => x.PreferedLanguage)
                .NotEmpty()
                .WithMessage("Одберете јазик, полето е задолжително.");

            //RuleFor(x => x.Pos)
            //  .NotEmpty()
            //  .WithMessage("Pos е задолжителнo.");
        }
    }

}