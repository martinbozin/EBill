using System;

namespace EBills.Infrastructure.Helpers
{
    public class HelpersMethods
    {
        public static byte[] GetBytes(string str)
        {
            byte[] bytes = new byte[str.Length * sizeof(char)];
            Buffer.BlockCopy(str.ToCharArray(), 0, bytes, 0, bytes.Length);
            return bytes;
        }

        public static string RemoveIllegalCharacters(string input)
        {
            var badChars = new[] { ':', '/', '\\', ':', '*', '?', '"', '<', '>', '|', '#', '{', '}', '%', '~', '&' };
            return String.Concat(input.Split(badChars, StringSplitOptions.RemoveEmptyEntries));
        }

     
    }
}
