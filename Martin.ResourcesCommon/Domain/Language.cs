using System;

namespace Martin.ResourcesCommon.Domain
{

    [Serializable]
    public class Language
    {
        public int Id { get; set; }

        public string ShortTitle { get; set; }

        public string Title { get; set; }

        public string GapiLang { get; set; }

        public int CultureID { get; set; }

        public bool Enabled { get; set; }

        public bool Default { get; set; }

        public bool ContentEnabled { get; set; }
    }

}
