using System;
using System.Linq;

namespace EBills.Infrastructure.Extensions
{
    public static class TimeSpanExtensions
    {
        public static string ToFriendlyDisplay(this TimeSpan timeSpan, string daysName, string hoursName, string minutesName)
        {
            var parts = new[]
                            {
                                Tuple.Create(daysName, timeSpan.Days),
                                Tuple.Create(hoursName, timeSpan.Hours),
                                Tuple.Create(minutesName, timeSpan.Minutes),
                            };

            return string.Join(", ", parts.Select(p => string.Format("{0} {1}", p.Item2, p.Item1)));
        }
    }
}
