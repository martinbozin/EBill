using System;

namespace EBills.Infrastructure.Exceptions
{
    public class DuplicateKeyException : Exception
    {
        public DuplicateKeyException() { }

        public DuplicateKeyException(string message)
            : base(message)
        {

        }
    }
}
