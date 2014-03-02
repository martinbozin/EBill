using EBills.Infrastructure.Grid;
using EBills.Web.Controllers.Shared.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EBills.Web.Controllers.Base
{
    public abstract class JqGridControllerBase<T> : AppControllerBase where T : GridItemBase
    {
        private readonly HttpContextBase _ctx;
        private readonly HttpRequestBase _rq;

        protected JqGridControllerBase()
        {
            _ctx = new HttpContextWrapper(System.Web.HttpContext.Current);
            _rq = _ctx.Request;

        }

        protected JqGridControllerBase(HttpContextBase context)
        {
            _ctx = context;
            _rq = _ctx.Request;
        }

        private enum Operation
        {
            Add,
            Edit,
            Delete,
            Grid
        }

        private Operation _requestedOperation;

        private readonly JqGridModel _gridModel = new JqGridModel();
        private GridSettings _gridSettings = new GridSettings();
        protected T GridModel;

        private void LogPostedValues()
        {
            var allKeys = _rq.Form.AllKeys;
            foreach (var diag in allKeys.Select(key => string.Format("{0}:{1}", key, _rq[key])))
            {
                Log.Debug(diag);
            }
            Log.Debug("******************************");
        }

        private Operation DetermineOperation()
        {
            string submitedOperation = Request.Form["oper"];
            switch (submitedOperation)
            {
                case "edit":
                    return Operation.Edit;
                case "add":
                    return Operation.Add;
                case "del":
                    return Operation.Delete;
                default:
                    return Operation.Grid;
            }
        }

        private void GetData()
        {
            IList<T> result = FetchData(_gridSettings);

            _gridModel.Page = _gridSettings.PageIndex;
            _gridModel.Records = _gridSettings.Totalrecords;

            var numPages = _gridModel.Records > 0 && _gridSettings.PageSize > 0
                               ? Convert.ToInt32(Math.Ceiling((_gridModel.Records / (decimal)_gridSettings.PageSize)))
                               : 0;

            if (_gridModel.Page > numPages)
                _gridModel.Page = numPages;

            _gridModel.Total = numPages;
            if (result == null)
            {
                result = new List<T>();
            }

            // ReSharper disable CoVariantArrayConversion
            _gridModel.Rows = result.ToArray();
            // ReSharper restore CoVariantArrayConversion
        }

        [HttpPost]
        public virtual ActionResult GridOperation(T model)
        {
            try
            {
                LogPostedValues();

                GridModel = model;

                _requestedOperation = DetermineOperation();
                switch (_requestedOperation)
                {
                    case Operation.Edit:
                        return Update();
                    case Operation.Delete:
                        return Delete();
                    case Operation.Add:
                        return Add();
                    default:
                        throw new InvalidOperationException();

                }
            }
            catch (Exception ex)
            {
                Log.Error(ex);
                throw;
            }
        }

        [HttpPost]
        public virtual ActionResult Grid(GridSettings gridSettings)
        {
            try
            {
                LogPostedValues();

                _requestedOperation = DetermineOperation();

                switch (_requestedOperation)
                {
                    case Operation.Grid:
                        _gridSettings = gridSettings;

                        GetData();

                        return Json(_gridModel, JsonRequestBehavior.DenyGet);
                    default:
                        throw new InvalidOperationException();
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex);
                throw;
            }
        }

        protected abstract IList<T> FetchData(GridSettings gridSettings);

        protected virtual ActionResult Add()
        {
            throw new NotImplementedException();
        }

        protected virtual ActionResult Delete()
        {
            throw new NotImplementedException();
        }

        protected virtual ActionResult Update()
        {
            throw new NotImplementedException();
        }

    }
}
