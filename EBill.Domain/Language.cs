
using System;

namespace EBills.Domain
{
    public class Language 
    {
        public virtual int Id { get; set; }
        private string _shortTitle;
        private string _title;
        private readonly int _cultureId;
        private readonly string _gapiLang;
        private bool _enabled;
        private bool _default;
        private bool _contentEnabled;
       
        protected Language() { }

        public Language(int id, string shortTitle, string title, int cultureId, string gapiLang)
        {
            if (string.IsNullOrEmpty(shortTitle))
                throw new ArgumentNullException("shortTitle");
            if (string.IsNullOrEmpty(title))
                throw new ArgumentNullException("title");
            if (cultureId < 1)
                throw new ArgumentNullException("cultureId");
            if (string.IsNullOrEmpty(gapiLang))
                throw new ArgumentNullException("gapiLang");

            Id = id;

            _shortTitle = shortTitle;
            _title = title;
            _cultureId = cultureId;
            _gapiLang = gapiLang;


            _enabled = false;
            _default = false;
            _contentEnabled = true;
        }


        public virtual string ShortTitle
        {
            get { return _shortTitle; }

        }

        public virtual void SetShortTitle(string shortTitle)
        {
            if (string.IsNullOrEmpty(shortTitle))
                throw new ArgumentNullException("shortTitle");

            _shortTitle = shortTitle;
        }

        public virtual string Title
        {
            get { return _title; }
        }

        public virtual void SetTitle(string title)
        {
            if (string.IsNullOrEmpty(title))
                throw new ArgumentNullException("title");

            _title = title;
        }

        public virtual int CultureId
        {
            get { return _cultureId; }
        }

        public virtual string GapiLang
        {
            get { return _gapiLang; }
        }

        public virtual bool Enabled
        {
            get { return _enabled; }
        }

        public virtual void SetEnabled(bool enabled = true)
        {
            _enabled = enabled;
        }

        public virtual bool Default
        {
            get { return _default; }
        }

        public virtual void SetDefault(bool def = true)
        {
            _default = def;
        }

        public virtual bool ContentEnabled
        {
            get { return _contentEnabled; }
        }

        public virtual void SetContentEnabled(bool contentEnabled)
        {
            _contentEnabled = contentEnabled;
        }
    }
}
