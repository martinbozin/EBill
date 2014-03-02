using EBills.Infrastructure.Grid;
using FluentValidation;
using FluentValidation.Attributes;
using System;

namespace EBills.Web.ViewModels
{

    [Validator(typeof(LocalizationGridModelValidator))]
    public class LocalizationGridModel : GridItemBase
    {

        public Guid LocalizationId { get; set; }

        public string Key { get; set; }
        public string Value { get; set; }
        public bool JavaScript { get; set; }
        public string Language { get; set; }
    }

    public class LocalizationGridModelValidator : AbstractValidator<LocalizationGridModel>
    {
        public LocalizationGridModelValidator()
        {
            RuleFor(x => x.Key)
                .NotEmpty()
                .WithMessage("Key е задолжително.");

            RuleFor(x => x.Value)
             .NotEmpty()
             .WithMessage("Value е задолжително.");

            RuleFor(x => x.Language)
             .NotEmpty()
             .WithMessage("Language е задолжително.");
        }
    }
}