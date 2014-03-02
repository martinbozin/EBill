using System.Collections.Generic;

namespace EBills.Infrastructure.Models
{
    public abstract class AppModel
    {
        private readonly Dictionary<string, List<string>> _errorCollection;
        protected AppModel()
        {
            _errorCollection = new Dictionary<string, List<string>>();
        }

        public bool HasErrors { get; set; }

        public Dictionary<string, List<string>> Errors
        {
            get { return _errorCollection; }

        }
    }
}