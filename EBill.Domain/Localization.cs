
using System;

namespace EBills.Domain
{

    /// <summary>
    /// Локализација
    /// </summary>
    public class Localization 
    {
        private string _key;
        private string _value;
        private bool _javaScript;
        private string _language;

        public virtual Guid Id { get; set; }

        protected Localization()
        {
        }

        public Localization(string key, string value, bool javaScript, string language)
        {
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException("key");
            }
            if (string.IsNullOrEmpty(value))
            {
                throw new ArgumentNullException("value");
            }
            if (string.IsNullOrEmpty(language))
            {
                throw new ArgumentNullException("language");
            }

            _key = key;
            _value = value;
            _javaScript = javaScript;
            _language = language;

        }

        public virtual string Key
        {
            get { return _key; }
        }

        public virtual string Value
        {
            get { return _value; }
        }

        public virtual bool JavaScript
        {
            get { return _javaScript; }
        }
        public virtual string Language
        {
            get { return _language; }
        }


        public virtual void SetValue(string value)
        {
            if (string.IsNullOrEmpty(value))
                throw new ArgumentNullException("value");
            _value = value;
        }


    }
}
