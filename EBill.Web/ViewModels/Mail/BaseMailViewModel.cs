using System.Configuration;

namespace EBills.Web.ViewModels.Mail
{
    public class BaseMailViewModel
    {
        /// <summary>
        /// Емаил Адреса на која ке се испрака пораката
        /// </summary>
        public string To { get; set; }

        /// <summary>
        /// Јазик на кој треба да се испрати
        /// </summary>
        public string LanguageKey { get; set; }


        
        /// <summary>
        /// FromMail
        /// </summary>
        public string FromMail
        {
            get
            {
                return ConfigurationManager.AppSettings["FromMail"];
            }
        }

        /// <summary>
        /// Protocol
        /// </summary>
        public string Protocol
        {
            get
            {
                return ConfigurationManager.AppSettings["Protocol"];
            }
        }


        /// <summary>
        /// Protocol
        /// </summary>
        public string HostName
        {
            get
            {
                return ConfigurationManager.AppSettings["HostName"];
            }
        }

    }
}