using System;

namespace Martin.ResourcesCommon.Domain
{
    public class LocalizedValue
    {
        public Guid Id { get; set; }

        public string Key { get; set; }

        public string Value { get; set; }

        public string Language { get; set; }

        public bool JavaScript { get; set; }
    }
}
