using Martin.ResourcesCommon.Domain;
using Martin.ResourcesCommon.Properties;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;

namespace Martin.ResourcesCommon.Data
{
    public partial class ResourcesCommonDataProvider
    {
        public Language GetLanguageById(int id)
        {
            try
            {
                SqlCommand command = new SqlCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "loc.LanguagesGetById";
                command.Connection = this.Connection;

                SqlParameter parameter = null;

                parameter = new SqlParameter();
                parameter.Direction = ParameterDirection.Input;
                parameter.SqlDbType = SqlDbType.Int;
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

                return LanguageGetFromDataRow(dataset.Tables[0].Rows[0]);
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

        public Language GetPreferredLanguageForUser(string userName)
        {
            try
            {
                SqlCommand command = new SqlCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = Settings.Default.GetPreferredLanguageProcedure;
                command.Connection = this.Connection;

                SqlParameter parameter = null;

                parameter = new SqlParameter();
                parameter.Direction = ParameterDirection.Input;
                parameter.SqlDbType = SqlDbType.NVarChar;
                parameter.ParameterName = "@UserName";
                parameter.Value = userName;
                command.Parameters.Add(parameter);


                SqlDataAdapter dataadapter = new SqlDataAdapter();
                dataadapter.SelectCommand = command;

                DataSet dataset = new DataSet();
                dataset.Locale = CultureInfo.InvariantCulture;
                dataadapter.Fill(dataset);

                if (dataset.Tables.Count == 0) return null;
                if (dataset.Tables[0].Rows.Count == 0) return null;

                return LanguageGetFromDataRow(dataset.Tables[0].Rows[0]);
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

        public Language GetDefaultLanguage()
        {
            try
            {
                SqlCommand command = new SqlCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "loc.LanguageGetDefault";
                command.Connection = this.Connection;

                SqlDataAdapter dataadapter = new SqlDataAdapter();
                dataadapter.SelectCommand = command;

                DataSet dataset = new DataSet();
                dataset.Locale = CultureInfo.InvariantCulture;
                dataadapter.Fill(dataset);

                if (dataset.Tables.Count == 0) return null;
                if (dataset.Tables[0].Rows.Count == 0) return null;

                return LanguageGetFromDataRow(dataset.Tables[0].Rows[0]);
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

        //gi dava site enejblirani jazici
        public List<Language> GetAllEnabledLanguages()
        {
            try
            {
                SqlCommand command = new SqlCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "loc.LanguagesGetAllEnabled";
                command.Connection = this.Connection;

                SqlDataAdapter dataadapter = new SqlDataAdapter();
                dataadapter.SelectCommand = command;

                DataSet dataset = new DataSet();
                dataset.Locale = CultureInfo.InvariantCulture;
                dataadapter.Fill(dataset);

                if (dataset.Tables.Count == 0) return null;

                return LanguageGetFromDataSet(dataset);
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

        //gi dava site jazici bez razlika dali se enabled ili disabled
        public List<Language> GetAllLanguages()
        {
            try
            {
                SqlCommand command = new SqlCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "loc.LanguagesGetAll";
                command.Connection = this.Connection;

                SqlDataAdapter dataadapter = new SqlDataAdapter();
                dataadapter.SelectCommand = command;

                DataSet dataset = new DataSet();
                dataset.Locale = CultureInfo.InvariantCulture;
                dataadapter.Fill(dataset);

                if (dataset.Tables.Count == 0) return null;

                return LanguageGetFromDataSet(dataset);
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

        //gi dava jazicite koi se Enabled i ContentEnabled
        public List<Language> GetContentEnabledLanguages()
        {
            try
            {
                SqlCommand command = new SqlCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "loc.LanguagesGetAllContentEnabled";
                command.Connection = this.Connection;

                SqlDataAdapter dataadapter = new SqlDataAdapter();
                dataadapter.SelectCommand = command;

                DataSet dataset = new DataSet();
                dataset.Locale = CultureInfo.InvariantCulture;
                dataadapter.Fill(dataset);

                if (dataset.Tables.Count == 0) return null;

                return LanguageGetFromDataSet(dataset);
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

        public void SavePreferredLanguageForUser(string userName, int id)
        {
            try
            {
                SqlCommand command = new SqlCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = Settings.Default.SavePreferredLanguageProcedure;
                command.Connection = this.Connection;

                SqlParameter parameter = null;

                parameter = new SqlParameter();
                parameter.Direction = ParameterDirection.Input;
                parameter.SqlDbType = SqlDbType.NVarChar;
                parameter.ParameterName = "@UserName";
                parameter.Value = userName;
                command.Parameters.Add(parameter);

                parameter = new SqlParameter();
                parameter.Direction = ParameterDirection.Input;
                parameter.SqlDbType = SqlDbType.NVarChar;
                parameter.ParameterName = "@Language";
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

        private static Language LanguageGetFromDataRow(DataRow row)
        {
            Language item = new Language();

            if (!row.IsNull("Id")) item.Id = int.Parse(row["Id"].ToString());
            if (!row.IsNull("ShortTitle")) item.ShortTitle = row["ShortTitle"].ToString();
            if (!row.IsNull("Title")) item.Title = row["Title"].ToString();
            if (!row.IsNull("GapiLang")) item.GapiLang = row["GapiLang"].ToString();
            if (!row.IsNull("CultureID")) item.CultureID = int.Parse(row["CultureID"].ToString());
            if (!row.IsNull("Enabled")) item.Enabled = bool.Parse(row["Enabled"].ToString());
            if (!row.IsNull("Default")) item.Default = bool.Parse(row["Default"].ToString());
            if (!row.IsNull("ContentEnabled")) item.ContentEnabled = bool.Parse(row["ContentEnabled"].ToString());

            return item;
        }

        private static List<Language> LanguageGetFromDataSet(DataSet dataset)
        {
            List<Language> items = new List<Language>();

            if (dataset.Tables.Count > 0)
            {
                foreach (DataRow row in dataset.Tables[0].Rows)
                {
                    items.Add(LanguageGetFromDataRow(row));
                }
            }

            return items;
        }
    }
}
