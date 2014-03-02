using EBills.Infrastructure.Models;
using System;

namespace EBills.Infrastructure.Exceptions
{
    public class ModelException : Exception
    {
        private readonly AppModel _appModel;
        public ModelException(AppModel appModel)
        {
            _appModel = appModel;
        }

        public AppModel Model
        {
            get { return _appModel; }
        }
    }
}