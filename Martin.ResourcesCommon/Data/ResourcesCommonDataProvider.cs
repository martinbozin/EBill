using log4net;
using Martin.ResourcesCommon.Properties;
using System;
using System.Data;
using System.Data.SqlClient;

namespace Martin.ResourcesCommon.Data
{
    public partial class ResourcesCommonDataProvider
    {
        private static readonly ILog log = LogManager.GetLogger("RESOURCESCOMMONDATAPROVIDER");
        private SqlConnection _connection = null;
        private string connectionString = Settings.Default.SqlDbConnection;

        public SqlConnection Connection 
        {
            get
            {
                try
                {
                    if (_connection == null) _connection = new SqlConnection(connectionString);

                    if ((_connection.State != ConnectionState.Open) &&
                        (_connection.State != ConnectionState.Connecting))
                    {
                        _connection.Open();
                    }

                    return _connection;
                }
                catch (Exception ex)
                {
                    log.Error(ex);
                    throw;
                }
            }
        }
        
    }

}
