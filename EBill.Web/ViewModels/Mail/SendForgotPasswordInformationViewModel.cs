using EBills.Web.ViewModels.Mail;

namespace EBills.Web.ViewModels.Mail
{
    public class SendForgotPasswordInformationViewModel : BaseMailViewModel
    {
        public string FullName { get; set; }
        public string RegistrationCode { get; set; }
        public string ApplicationtRootUrl { get; set; }
    }
}