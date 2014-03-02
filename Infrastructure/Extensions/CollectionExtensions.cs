using System;
using System.Collections.Generic;

namespace EBills.Infrastructure.Extensions
{
    public static class CollectionExtensions
    {
        public static void RemoveAll<T>(this IList<T> source, Predicate<T> predicate = null)
        {
            if (source == null)
                throw new ArgumentNullException("source");

            var tmp = new T[source.Count];
            source.CopyTo(tmp, 0);
            
            foreach (var elem in tmp)
            {
                source.Remove(elem);
            }

        }

    }
}
