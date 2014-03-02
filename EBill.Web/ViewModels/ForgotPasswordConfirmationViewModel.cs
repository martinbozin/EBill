using EBills.Infrastructure.Models;

namespace EBills.Web.ViewModels
{
    public class ForgotPasswordConfirmationViewModel :AppModel
    {
        public string UserName { get; set; }
        public string PasswordNew { get; set; }
        public string PasswordNewConfirm { get; set; }
    }
}