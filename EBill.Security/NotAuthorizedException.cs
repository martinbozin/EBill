using System;

namespace EBills.Security
{
    /// <summary>
    /// Exception кој се фрла доколку нема авторизација
    /// </summary>
    public class NotAuthorizedException : Exception
    {
        /// <summary>
        /// Конструктор
        /// </summary>
        /// <param name="message">Порака за грешка</param>
        public NotAuthorizedException(string message)
            : base(message)
        {

        }
    }

    /// <summary>
    /// Exception кој се фрла доколку нема автентикација
    /// </summary>
    public class NotAuthenticatedException : Exception
    {
        /// <summary>
        /// Конструктор
        /// </summary>
        /// <param name="message">Порака за грешка</param>
        public NotAuthenticatedException(string message)
            : base(message)
        {

        }
    }


}
