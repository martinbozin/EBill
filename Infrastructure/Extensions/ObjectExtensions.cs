using System;
using System.Web.Script.Serialization;

namespace EBills.Infrastructure.Extensions
{
    public static class ObjectExtensions
    {
        public static string ToJson(this object o)
        {
            var serializer = new JavaScriptSerializer();
            return serializer.Serialize(o);
        }

        public static T FromJson<T>(this string json)
        {
            var serializer = new JavaScriptSerializer();
            return serializer.Deserialize<T>(json);
        }

        public static object FromJson(this string json, Type type)
        {
            var serializer = new JavaScriptSerializer();
            return serializer.Deserialize(json, type);
        }
    }
}
