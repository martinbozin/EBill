 

namespace EBills.Domain
{
    public class FailedMailMessage  
    {
        private readonly string _message;

        protected FailedMailMessage() { }

        public FailedMailMessage(string message)
        {
            _message = message;
        }

        public virtual string Message
        {
            get { return _message; }
        }

        public virtual int RetryNumber { get; set; }

        public virtual bool Sended { get; set; }

    }
}
