using System.Configuration;
using System.Net;
using System.Net.Configuration;
using ActionMailer.Net.Mvc;
using EBills.Domain;
using EBills.Domain.Data;
using EBills.Infrastructure.SerializableEntities;
using Microsoft.Practices.ServiceLocation;

using Nextsense.Infrastructure.Data;
using System;
using System.IO;
using System.Net.Mail;
using System.Runtime.Serialization.Formatters.Binary;
using System.Threading;
using EBills.Web.ViewModels;
using EBills.Web.ViewModels.Mail;
using log4net;

namespace EBills.Web.Controllers
{
    /// <summary>
    /// https://bitbucket.org/swaj/actionmailer.net/wiki/Home
    /// </summary>
    public class MailController : MailerBase
    {
        protected static readonly ILog Log = LogManager.GetLogger("EMAILLOGGER");

        /// <summary>
        /// Праќа маил до избраните институции за барањето
        /// пр.(ЕВН, Водовод)
        /// </summary>
        /// <returns></returns>
        //public void SendEmailToInstitution(SendEmailToInstitutionViewModel model)
        //{
        //    To.Add(model.To);
        //    From = model.FromMail;
        //    Subject = "Се бара мислење за предмет";
        //    SendEmail(Email("SendEmailToInstitution", model));
        //}
        public void SendForgotPasswordInformation(SendForgotPasswordInformationViewModel model)
        {
            To.Add(model.To);
            From = ConfigurationManager.AppSettings["FromMail"];
            Subject = "Рестартирање на лозинка";
            SendEmail(Email("SentForgotPasswordInformation", model));
        }
    


        private void SendEmail(EmailResult result)
        {
            Log.InfoFormat("START SENDING EMAIL: TO:{0}, BCC:{1}, SUBJECT:{2}, BODY:{3}, TIME:{4}",
                                                              result.Mail.To,
                                                              result.Mail.Bcc,
                                                              result.Mail.Subject,
                                                              result.Mail.Body,
                                                              DateTime.Now
                                                              );

            var threadSendMails = new Thread(delegate()
                                                    {
                                                        try
                                                        {
                                                            using (new UnitOfWorkScope())
                                                            {
                                                                var appSettingsRepo =
                                                                    ServiceLocator.Current.GetInstance<IApplicationParameterRepository>();
                                                                var bcc = appSettingsRepo.GetByName("BCC");
                                                                if (bcc != null)
                                                                {
                                                                    result.Mail.Bcc.Add(bcc.ParameterValue);
                                                                }
                                                            }

                                                            //var mailSettings = ConfigurationManager.GetSection("system.net/mailSettings") as MailSettingsSectionGroup;
                                                            var smtpSettings = ConfigurationManager.GetSection("system.net/mailSettings/smtp") as SmtpSection;
                                                            if (smtpSettings != null)
                                                            {
                                                                var port = smtpSettings.Network.Port;
                                                                var host = smtpSettings.Network.Host;
                                                                var username = smtpSettings.Network.UserName;
                                                                var password = smtpSettings.Network.Password;

                                                                using (var client = new SmtpClient(host, port))
                                                                {
                                                                    if (!string.IsNullOrEmpty(username) &&
                                                                        !string.IsNullOrEmpty(password))
                                                                    {
                                                                        client.UseDefaultCredentials = false;
                                                                        client.Credentials = new NetworkCredential(username, password);
                                                                        client.Send(result.Mail);
                                                                    }
                                                                    else
                                                                    {
                                                                        client.UseDefaultCredentials = true;
                                                                        client.Send(result.Mail);
                                                                    }
                                                                }
                                                            }

                                                            Log.InfoFormat("END SENDING EMAIL: TO:{0}, BCC:{1}, SUBJECT:{2}, BODY:{3}, TIME:{4}",
                                                                                  result.Mail.To,
                                                                                  result.Mail.Bcc,
                                                                                  result.Mail.Subject,
                                                                                  result.Mail.Body,
                                                                                  DateTime.Now
                                                                                  );

                                                            //Log.ErrorFormat("Email:{0}", result.Mail.To);
                                                        }
                                                        catch (SmtpException smtpEx)
                                                        {
                                                            var serializedMessage = SerializeMessage(result.Mail);
                                                            try
                                                            {
                                                                using (var scope = new UnitOfWorkScope())
                                                                {
                                                                    var failedMessage = new FailedMailMessage(serializedMessage);
                                                                    var failedMessageRepo = ServiceLocator.Current.GetInstance<IRepository<FailedMailMessage>>();

                                                                    failedMessageRepo.Save(failedMessage);
                                                                    scope.Commit();
                                                                }
                                                            }
                                                            catch (Exception ex)
                                                            {
                                                                Log.Error(ex);
                                                                System.IO.File.WriteAllText(@"C:\temp\" + Guid.NewGuid().ToString() + ".txt", serializedMessage);
                                                            }

                                                            Log.ErrorFormat("ERROR WHILE SENDING EMAIL: TO:{0}, BCC:{1}, SUBJECT:{2}, BODY:{3}, TIME:{4}",
                                                                               result.Mail.To,
                                                                               result.Mail.Bcc,
                                                                               result.Mail.Subject,
                                                                               result.Mail.Body,
                                                                               DateTime.Now
                                                                               );
                                                            Log.Error(smtpEx);
                                                            if (smtpEx.InnerException != null)
                                                            {
                                                                Log.Error(smtpEx.InnerException);
                                                            }

                                                        }
                                                    });
            threadSendMails.IsBackground = true;
            threadSendMails.Start();
        }


        private string SerializeMessage(MailMessage mailMessage)
        {
            string serializedMessage;
            using (var ms = new MemoryStream())
            {
                var serializedMailMessage = new SerializeableMailMessage(mailMessage);
                new BinaryFormatter().Serialize(ms, serializedMailMessage);
                serializedMessage = Convert.ToBase64String(ms.ToArray());
            }
            return serializedMessage;
        }

        private MailMessage DeserializeMessage(string serializedMessage)
        {
            byte[] bytes = Convert.FromBase64String(serializedMessage);

            using (var ms = new MemoryStream(bytes))
            {
                var serializedMailMessage = (SerializeableMailMessage)new BinaryFormatter().Deserialize(ms);
                return serializedMailMessage.GetMailMessage();
            }
        }

    }
}