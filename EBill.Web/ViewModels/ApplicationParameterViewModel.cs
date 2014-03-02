using EBills.Infrastructure.Models;
using FluentValidation;
using FluentValidation.Attributes;
using System;

namespace EBills.Web.ViewModels
{

    [Validator(typeof(ApplicationParameterViewModelValidator))]
    public class ApplicationParameterViewModel : AppModel
    {
        public int Id { get; set; }
        public string ParameterType { get; set; }
        public string ParameterName { get; set; }
        public string ParameterValue { get; set; }
        public DateTime? ParameterValidUntil { get; set; }
        public DateTime ParameterValidFrom { get; set; }
        public string ParameterDescription { get; set; }
    }

    public class ApplicationParameterViewModelValidator : AbstractValidator<ApplicationParameterViewModel>
    {
        public ApplicationParameterViewModelValidator()
        {
            RuleFor(x => x.ParameterName).NotEmpty();
            RuleFor(x => x.ParameterValue).NotEmpty();
        }
    }
}