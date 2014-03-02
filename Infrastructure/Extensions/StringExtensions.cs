using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace EBills.Infrastructure.Extensions
{
   public static class StringExtensions
    {
        public static string StripHtml(this string s)
        {
            Regex rx = new Regex("<[^>]*>");
            return rx.Replace(s, string.Empty);
        }

        public static string Md5String(this string s)
        {

            if (string.IsNullOrEmpty(s))
            {
                throw new ArgumentNullException();
            }
            return Convert.ToBase64String(
                new MD5CryptoServiceProvider().ComputeHash(Encoding.Default.GetBytes(s)));

        }
        //public static string Md5StringNoConvertToBase64(this string s)
        //{

        //    if (string.IsNullOrEmpty(s))
        //    {
        //        throw new ArgumentNullException();
        //    }
        //    return new MD5CryptoServiceProvider().ComputeHash(Encoding.Default.GetBytes(s)).ToString();

        //}

        public static string Quote(this string text)
        {
            return String.Concat("\"", text, "\"");
        }

    }
}
