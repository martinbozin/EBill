using EBills.Infrastructure.Grid;
using FluentValidation;
using FluentValidation.Attributes;

namespace EBills.Web.Areas.Administration.Models
{
    [Validator(typeof(PosGridModelValidator))]
    public class PosGridModel : GridItemBase
    {
        public string PosName { get; set; }
        public string PrimaryContact { get; set; }
        public bool IsActive { get; set; }
        public string Phone { get; set; }
        public string AdditionalEmailAdresses { get; set; }
 
        //public string Address { get; set; }
    }

    public class PosGridModelValidator : AbstractValidator<PosGridModel>
    {
        public PosGridModelValidator()
        {
            RuleFor(x => x.PosName)
               .NotEmpty()
               .WithMessage("Името е задолжително.");

            RuleFor(x => x.PrimaryContact)
                .NotEmpty()
                .WithMessage("Контактот е задолжителен.");

            RuleFor(x => x.Phone)
                .NotEmpty()
                .WithMessage("Телфонот е задолжителен.");


            //RuleFor(x => x.Pos)
            //  .NotEmpty()
            //  .WithMessage("Pos е задолжителнo.");
        }
    }

}