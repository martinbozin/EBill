using EBills.Infrastructure.Grid;
using FluentValidation;
using FluentValidation.Attributes;

namespace EBills.Web.ViewModels
{
    [Validator(typeof(InstitutionGridModelValidator))]
    public class InstitutionGridModel : GridItemBase
    {
        public string Name { get; set; }
        public string NameAl { get; set; }
        public string AdditionalEmailAdresses { get; set; }
        public bool IsActive { get; set; }
        public bool AllMunicipalities { get; set; }
        public int KatastarId { get; set; }
    }

    public class InstitutionGridModelValidator : AbstractValidator<InstitutionGridModel>
    {
        public InstitutionGridModelValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty();
                //.WithMessage(
                //Martin.ResourcesCommon.ResourceManager.GetResourceValue("eDozvoli.Web.ViewModels.CadastreMunicipalityGridGridModel.Ime"));
            //"Име е задолжително."

            RuleFor(x => x.NameAl)
                .NotEmpty();

            //"Име на албански е задолжително."
        }
    }
}