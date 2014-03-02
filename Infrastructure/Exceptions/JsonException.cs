using System;

namespace EBills.Infrastructure.Exceptions
{
    public class JsonException : Exception
    {
        public JsonException(string message)
            : base(message)
        {

        }
    }
}