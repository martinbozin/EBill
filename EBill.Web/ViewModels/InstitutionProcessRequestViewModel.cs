using EBills.Infrastructure.Models;
using FluentValidation;
using FluentValidation.Attributes;
using System;

namespace EBills.Web.ViewModels
{
    [Validator(typeof(InstitutionProcessRequestViewModelValidator))]
    public class InstitutionProcessRequestViewModel : AppModel
    {
        public Guid RequestId { get; set; }
        public int? StatusId { get; set; }
        public string Comment { get; set; }

    }

    public class InstitutionProcessRequestViewModelValidator : AbstractValidator<InstitutionProcessRequestViewModel>
    {
        public InstitutionProcessRequestViewModelValidator()
        {
            RuleFor(x => x.RequestId)
                                    .NotEmpty();

            RuleFor(x => x.StatusId)
                .NotNull();
 
        }
    }

}