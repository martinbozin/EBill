using Martin.ResourcesCommon.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;

namespace Martin.ResourcesCommon.Data
{
    public partial class ResourcesCommonDataProvider
    {
        public LocalizedValue GetLocalizedValue(Guid id)
        {
            try
            {
                SqlCommand command = new SqlCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "loc.LocalizationGetById";
                command.Connection = this.Connection;

                SqlParameter parameter = null;

                parameter = new SqlParameter();
                parameter.Direction = ParameterDirection.Input;
                parameter.SqlDbType = SqlDbType.UniqueIdentifier;
                parameter.ParameterName = "@Id";
                parameter.Value = id;
                command.Parameters.Add(parameter);

                SqlDataAdapter dataadapter = new SqlDataAdapter();
                dataadapter.SelectCommand = command;

                DataSet dataset = new DataSet();
                dataset.Locale = CultureInfo.InvariantCulture;
                dataadapter.Fill(dataset);

                if (dataset.Tables.Count == 0) return null;
                if (dataset.Tables[0].Rows.Count == 0) return null;

                return LocalizedValueGetFromDataRow(dataset.Tables[0].Rows[0]);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
            finally
            {
                _connection.Close();
            }
        }

        public List<LocalizedValue> GetLocalizationByKeyAndLanguageAndType(string key, string language, bool? isJavaScript)
        {
            try
            {
                SqlCommand command = new SqlCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "loc.LocalizationGetByKeyAndLanguageAndType";
                command.Connection = this.Connection;

                SqlParameter parameter = null;

                if (!string.IsNullOrEmpty(key))
                {
                    parameter = new SqlParameter();
                    parameter.Direction = ParameterDirection.Input;
                    parameter.SqlDbType = SqlDbType.NVarChar;
                    parameter.ParameterName = "@Key";
                    parameter.Value = key;
                    command.Parameters.Add(parameter);
                }

                if (!string.IsNullOrEmpty(language))
                {
                    parameter = new SqlParameter();
                    parameter.Direction = ParameterDirection.Input;
                    parameter.SqlDbType = SqlDbType.NVarChar;
                    parameter.ParameterName = "@Language";
                    parameter.Value = language;
                    command.Parameters.Add(parameter);
                }

                if (isJavaScript.HasValue)
                {
                    parameter = new SqlParameter();
                    parameter.Direction = ParameterDirection.Input;
                    parameter.SqlDbType = SqlDbType.Bit;
                    parameter.ParameterName = "@JavaScript";
                    parameter.Value = isJavaScript.Value;
                    command.Parameters.Add(parameter);
                }

                SqlDataAdapter dataadapter = new SqlDataAdapter();
                dataadapter.SelectCommand = command;

                DataSet dataset = new DataSet();
                dataset.Locale = CultureInfo.InvariantCulture;
                dataadapter.Fill(dataset);

                if (dataset.Tables.Count == 0) return null;

                return LocalizedValueGetFromDataSet(dataset);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
            finally
            {
                _connection.Close();
            }
        }

        public List<LocalizedValue> GetLocalizationFiltered(int pageNum, int pageSize, string key, string value, string language, out int recordCount)
        {
            SqlConnection cn = null;

            try
            {
                cn = this.Connection;

                recordCount = 0;

                SqlCommand command = new SqlCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "loc.LocalizationGetFiltered";
                command.Connection = this.Connection;

                SqlParameter parameter = null;

                parameter = new SqlParameter();
                parameter.Direction = ParameterDirection.Input;
                parameter.SqlDbType = SqlDbType.Int;
                parameter.ParameterName = "@PageNum";
                parameter.Value = pageNum;
                command.Parameters.Add(parameter);

                parameter = new SqlParameter();
                parameter.Direction = ParameterDirection.Input;
                parameter.SqlDbType = SqlDbType.Int;
                parameter.ParameterName = "@PageSize";
                parameter.Value = pageSize;
                command.Parameters.Add(parameter);

                if (!string.IsNullOrEmpty(key))
                {
                    parameter = new SqlParameter();
                    parameter.Direction = ParameterDirection.Input;
                    parameter.SqlDbType = SqlDbType.NVarChar;
                    parameter.ParameterName = "@Key";
                    parameter.Value = key;
                    command.Parameters.Add(parameter);
                }

                if (!string.IsNullOrEmpty(value))
                {
                    parameter = new SqlParameter();
                    parameter.Direction = ParameterDirection.Input;
                    parameter.SqlDbType = SqlDbType.NVarChar;
                    parameter.ParameterName = "@Value";
                    parameter.Value = value;
                    command.Parameters.Add(parameter);
                }

                if (!string.IsNullOrEmpty(language))
                {
                    parameter = new SqlParameter();
                    parameter.Direction = ParameterDirection.Input;
                    parameter.SqlDbType = SqlDbType.NVarChar;
                    parameter.ParameterName = "@Language";
                    parameter.Value = language;
                    command.Parameters.Add(parameter);
                }

                parameter = new SqlParameter();
                parameter.Direction = ParameterDirection.Output;
                parameter.SqlDbType = SqlDbType.Int;
                parameter.ParameterName = "@RecCount";
                parameter.Value = recordCount;
                command.Parameters.Add(parameter);

                command.Connection = cn;

                SqlDataAdapter dataadapter = new SqlDataAdapter();
                dataadapter.SelectCommand = command;

                DataSet dataset = new DataSet();
                dataset.Locale = CultureInfo.InvariantCulture;
                dataadapter.Fill(dataset);

                recordCount = (int)command.Parameters["@RecCount"].Value;

                if (dataset.Tables.Count == 0) return null;

                return LocalizedValueGetFromDataSet(dataset);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
            finally
            {
                _connection.Close();
            }
        }

        public List<LocalizedValue> GetLocalizationFilteredNotPaged(string key, string value, string language, bool? javascript)
        {
            SqlConnection cn = null;

            try
            {
                cn = this.Connection;

                SqlCommand command = new SqlCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "loc.LocalizationGetFilteredNotPaged";
                command.Connection = this.Connection;

                SqlParameter parameter = null;

                if (!string.IsNullOrEmpty(key))
                {
                    parameter = new SqlParameter();
                    parameter.Direction = ParameterDirection.Input;
                    parameter.SqlDbType = SqlDbType.NVarChar;
                    parameter.ParameterName = "@Key";
                    parameter.Value = key;
                    command.Parameters.Add(parameter);
                }

                if (!string.IsNullOrEmpty(value))
                {
                    parameter = new SqlParameter();
                    parameter.Direction = ParameterDirection.Input;
                    parameter.SqlDbType = SqlDbType.NVarChar;
                    parameter.ParameterName = "@Value";
                    parameter.Value = value;
                    command.Parameters.Add(parameter);
                }

                if (!string.IsNullOrEmpty(language))
                {
                    parameter = new SqlParameter();
                    parameter.Direction = ParameterDirection.Input;
                    parameter.SqlDbType = SqlDbType.NVarChar;
                    parameter.ParameterName = "@Language";
                    parameter.Value = language;
                    command.Parameters.Add(parameter);
                }

                if (javascript.HasValue)
                {
                    parameter = new SqlParameter();
                    parameter.Direction = ParameterDirection.Input;
                    parameter.SqlDbType = SqlDbType.Bit;
                    parameter.ParameterName = "@JavaScript";
                    parameter.Value = javascript.Value;
                    command.Parameters.Add(parameter);
                }

                command.Connection = cn;

                SqlDataAdapter dataadapter = new SqlDataAdapter();
                dataadapter.SelectCommand = command;

                DataSet dataset = new DataSet();
                dataset.Locale = CultureInfo.InvariantCulture;
                dataadapter.Fill(dataset);

                if (dataset.Tables.Count == 0) return null;

                return LocalizedValueGetFromDataSet(dataset);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
            finally
            {
                _connection.Close();
            }
        }

        public void Create(LocalizedValue localizedValue)
        {
            try
            {
                SqlCommand command = new SqlCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "loc.LocalizationCreate";
                command.Connection = this.Connection;

                SqlParameter parameter = null;

                parameter = new SqlParameter();
                parameter.Direction = ParameterDirection.Input;
                parameter.SqlDbType = SqlDbType.NVarChar;
                parameter.ParameterName = "@Key";
                parameter.Value = localizedValue.Key;
                command.Parameters.Add(parameter);

                parameter = new SqlParameter();
                parameter.Direction = ParameterDirection.Input;
                parameter.SqlDbType = SqlDbType.NVarChar;
                parameter.ParameterName = "@Value";
                parameter.Value = localizedValue.Value;
                command.Parameters.Add(parameter);

                parameter = new SqlParameter();
                parameter.Direction = ParameterDirection.Input;
                parameter.SqlDbType = SqlDbType.NVarChar;
                parameter.ParameterName = "@Language";
                parameter.Value = localizedValue.Language;
                command.Parameters.Add(parameter);

                parameter = new SqlParameter();
                parameter.Direction = ParameterDirection.Input;
                parameter.SqlDbType = SqlDbType.Bit;
                parameter.ParameterName = "@JavaScript";
                parameter.Value = localizedValue.JavaScript;
                command.Parameters.Add(parameter);

                command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                log.Error(ex);
            }
            finally
            {
                _connection.Close();
            }
        }

        public void Save(LocalizedValue localizedValue)
        {
            try
            {
                SqlCommand command = new SqlCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "loc.LocalizationSave";
                command.Connection = this.Connection;

                SqlParameter parameter = null;

                parameter = new SqlParameter();
                parameter.Direction = ParameterDirection.Input;
                parameter.SqlDbType = SqlDbType.UniqueIdentifier;
                parameter.ParameterName = "@Id";
                parameter.Value = localizedValue.Id;
                command.Parameters.Add(parameter);

                parameter = new SqlParameter();
                parameter.Direction = ParameterDirection.Input;
                parameter.SqlDbType = SqlDbType.NVarChar;
                parameter.ParameterName = "@Value";
                parameter.Value = localizedValue.Value;
                command.Parameters.Add(parameter);

                parameter = new SqlParameter();
                parameter.Direction = ParameterDirection.Input;
                parameter.SqlDbType = SqlDbType.Bit;
                parameter.ParameterName = "@JavaScript";
                parameter.Value = localizedValue.JavaScript;
                command.Parameters.Add(parameter);

                command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                log.Error(ex);
            }
            finally
            {
                _connection.Close();
            }
        }

        public void Delete(Guid id)
        {
            try
            {
                SqlCommand command = new SqlCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "loc.LocalizationDelete";
                command.Connection = this.Connection;

                SqlParameter parameter = null;

                parameter = new SqlParameter();
                parameter.Direction = ParameterDirection.Input;
                parameter.SqlDbType = SqlDbType.UniqueIdentifier;
                parameter.ParameterName = "@Id";
                parameter.Value = id;
                command.Parameters.Add(parameter);

                command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                log.Error(ex);
            }
            finally
            {
                _connection.Close();
            }
        }

        public void DeleteByKey(string key)
        {
            try
            {
                SqlCommand command = new SqlCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "loc.LocalizationDeleteByKey";
                command.Connection = this.Connection;

                SqlParameter parameter = null;

                parameter = new SqlParameter();
                parameter.Direction = ParameterDirection.Input;
                parameter.SqlDbType = SqlDbType.NVarChar;
                parameter.ParameterName = "@Key";
                parameter.Value = key;
                command.Parameters.Add(parameter);

                command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                log.Error(ex);
            }
            finally
            {
                _connection.Close();
            }
        }

        private static LocalizedValue LocalizedValueGetFromDataRow(DataRow row)
        {
            LocalizedValue item = new LocalizedValue();

            if (!row.IsNull("Id")) item.Id = new Guid(row["Id"].ToString());
            if (!row.IsNull("Key")) item.Key = row["Key"].ToString();
            if (!row.IsNull("Value")) item.Value = row["Value"].ToString();
            if (!row.IsNull("Language")) item.Language = row["Language"].ToString();
            if (!row.IsNull("JavaScript")) item.JavaScript = bool.Parse(row["JavaScript"].ToString());

            return item;
        }

        private static List<LocalizedValue> LocalizedValueGetFromDataSet(DataSet dataset)
        {
            List<LocalizedValue> items = new List<LocalizedValue>();

            if (dataset.Tables.Count > 0)
            {
                foreach (DataRow row in dataset.Tables[0].Rows)
                {
                    items.Add(LocalizedValueGetFromDataRow(row));
                }
            }

            return items;
        }
    }
}
