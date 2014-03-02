
using EBills.Domain;
using EBills.Domain.Data;
using EBills.Infrastructure.Exceptions;
using EBills.Infrastructure.Extensions;
using EBills.Infrastructure.Helpers;
using EBills.Infrastructure.MVC.Notification;
using EBills.Web.Controllers.Shared.Base;
using EBills.Web.ViewModels;
using EBills.Web.ViewModels.Mail;
using Microsoft.Practices.ServiceLocation;

using Nextsense.Infrastructure.Data;
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace EBills.Web.Controllers
{
    public class AccountController : AppControllerBase
    {
        private readonly IUserRepository _repository;
        public AccountController(IUserRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Registration()
        {
            return View("Registration");
        }

        /// <summary>
        /// Регистрација на нов корисник
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        public ActionResult Registration(RegistrationViewModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {

                    PublicUser user = null;
                    bool valid = false;
                    string code = "";
                    using (var scope = new UnitOfWorkScope())
                    {
                        User userExist = _repository.GetUserByUsername(model.UserName);
                        if (userExist != null)
                        {
                            ModelState.AddModelError("UserName",
                                            "Корисник со ова корисничко име веке постои во системот.");

                        }
                        //else if (Session["Captcha"] == null || Session["Captcha"].ToString() != model.CaptchaValue)
                        //{
                        //    ModelState.AddModelError("CaptchaValue", "Погрешна вредност на сумата.");
                        //    //dispay error and generate a new captcha

                        //}

                        else
                        {
                            var languageRepository = ServiceLocator.Current.GetInstance<IRepository<Language>>();
                            Language defaultLanguage = languageRepository.Query().FirstOrDefault(z => z.Default);

                            code = RandomString(6);
                            string password = model.Password.Md5String();
                            user = new PublicUser(model.UserName, password, model.FirstName, model.LastName, defaultLanguage)
                            {
                                IsActive = false,
                                RegistrationCode = code
                            };
                            var roleRepository = ServiceLocator.Current.GetInstance<IRepository<Role>>();
                            //var role = roleRepository.Query().SingleOrDefault(x => x.RoleName == Domain.Roles.PublicUsers);
                            //user.AddToRole(role);

                            _repository.Save(user);
                            scope.Commit();
                            valid = true;
                            this.ShowMessage(MessageType.Success, "Потврдете ја регистрацијата преку вашиот e-mail.", true);
                        }
                    }
                    var appParametersRep = ServiceLocator.Current.GetInstance<IApplicationParameterRepository>();
                    var applicationtRootUrl = appParametersRep.GetByName("ApplicationtRootUrl").ParameterValue;
                    var protocol = appParametersRep.GetByName("Protocol").ParameterValue;

                    if (valid)
                    {
                        model.FullName = model.FirstName + " " + model.LastName;
                        model.ApplicationtRootUrl = applicationtRootUrl;
                        model.Protocol = protocol;
                        model.RegistrationCode = code;
            
                        return Json(true);
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty,
                                                  "Во моментов системот има технички проблеми.<br/>Обидете се повторно за некоја минута");
                    Log.Error(ex);

                }
            }
            throw base.CreateModelException(model);
        }

        /// <summary>
        /// Враќање на Confirmation View
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public ActionResult Confirmation()
        {
            return View("Confirmation");
        }

        /// <summary>
        /// Submit на регистрација и проверка дали е внесен правилен код
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        public ActionResult Confirmation(RegistrationConfirmationViewModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    using (var scope = new UnitOfWorkScope())
                    {
                        User user = _repository.GetUserByUsername(model.UserName);
                        if (user.UserName != model.UserName || user.RegistrationCode != model.Code)
                        {
                            ModelState.AddModelError("UserName", "Невалидно корисничко име или код!");
                        }
                        else
                        {

                            user.IsActive = true;
                            _repository.Update(user);
                            scope.Commit();

                            CreateAuthTicket(user, true);
                            return Json(true);
                        }
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, "Во моментов системот има технички проблеми.<br/>Обидете се повторно за некоја минута");
                    Log.Error(ex);
                }
            }
            throw base.CreateModelException(model);
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(NoStore = true, Duration = 0)]
        public ActionResult Login()
        {
            FormsAuthentication.SignOut();
            Response.Cookies.Clear();
            Session.Clear();
            Session.Abandon();

            LoginViewModel model = new LoginViewModel();
            return View(model);
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        [OutputCache(NoStore = true, Duration = 0)]
        public ActionResult Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                string url = Request.QueryString["ReturnUrl"];
                if (string.IsNullOrEmpty(url))
                    url = Url.Action("Index", "Home");

                string username = model.Username;
                string password = model.Password;

                username = username.StripHtml();
                password = password.StripHtml();

                try
                {
                    //password = password.Md5String();
                    Log.Debug("LOGIN");

                    User user = _repository.GetUserByUsername(username);
                    if (user == null || user.Password != password)
                    {
                        ModelState.AddModelError(string.Empty, "Невалидно корисничко име или лозинка!");
                        return View("Login", model);
                    }

                    if (!user.IsActive)
                    {
                        ModelState.AddModelError(string.Empty, "Корисникот е деактивиран!");
                        return View("Login", model);
                    }


                    CreateAuthTicket(user, model.RememberMe);

                    //if (user.CertificateRawBytes == null)
                    //{
                    //    var userRoles =
                    //        user.Roles.Any(
                    //            x =>
                    //            x.RoleName == "ZelsAdministrator"
                    //            || x.RoleName == "Administrator"
                    //            || x.RoleName == "MTVSupervisor"
                    //            || x.RoleName == "Inspektor"
                    //            || x.RoleName == "UpravenInspektor");
                    //    if (!userRoles)
                    //    {
                    //        this.ShowMessage(
                    //            MessageType.Warning,
                    //            //ResourceManager.GetResourceValue("Controllers.AccountController.PrikaceteSertifikat"),
                    //            "Ве молиме прикачете го вашиот дигитален сертификат за да ви се овозможи работа на системот!",
                    //            true);
                    //        return RedirectToAction("Profile");
                    //    }
                    //}


                    //if (user.CertificateDateUntil < DateTime.Today)
                    //{
                    //    this.ShowMessage(
                    //        MessageType.Warning,
                    //        //ResourceManager.GetResourceValue("Controllers.AccountController.IstecenSertifikat"),
                    //        "Сертификатот е истечен. Прикачете валиден сертификат!",
                    //        true);
                    //    return RedirectToAction("Profile");
                    //}

                    return RedirectToAction("Index", "Home", new { area = "" });
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(
                        string.Empty,
                        "Во моментов системот има технички проблеми.<br/>Обидете се повторно за некоја минута");
                    Log.Error(ex);

                }
            }

            return View("Login", model);
        }

        private void CreateAuthTicket(User user, bool rememberMe)
        {
            string userdata = user.Id.ToString(CultureInfo.InvariantCulture);
            FormsAuthenticationTicket authTicket = new FormsAuthenticationTicket(1, user.UserName, DateTime.Now,
                                                                                 DateTime.Now.AddHours(4),
                                                                                 rememberMe, userdata);

            string encrypted = FormsAuthentication.Encrypt(authTicket);
            HttpCookie authCokie = new HttpCookie(FormsAuthentication.FormsCookieName, encrypted);
            Response.Cookies.Add(authCokie);

        }

        [Authorize]
        [HttpGet]
        public ActionResult Profile(bool? changePass = false)
        {

            var model = new ProfileViewModel
                            {
                                UserName = CurrentUser.UserName,
                                FirstName = CurrentUser.FirstName,
                                LastName = CurrentUser.LastName,

                            };

            //var backendUser = CurrentUser as BackendUser;
            //if (backendUser != null)
            //{
            //    model.Institution = ResourceManager.GetMultilangValue(backendUser.Institution.Name);
            //}
            //var user = _repository.GetUserByUsername(CurrentUser.UserName);
            //if (user.CertificateRawBytes != null)
            //{
            //    ViewBag.hasCertificate = user.CertificateRawBytes.ToString();
            //    ViewBag.CertificateDateUntil = user.CertificateDateUntil;
            //}
            //else
            //{
            //    ViewBag.hasCertificate = string.Empty;
            //}

            ViewBag.ChangePass = changePass;
            return View(model);
        }

        [Authorize]
        [HttpPost]
        public ActionResult Profile(ProfileViewModel model)
        {
            bool succeed = false;
            if (ModelState.IsValid)
            {
                if (CurrentUser.Password != model.Password.Md5String())
                {
                    ModelState.AddModelError("Password", "Лозинката мора да биде иста со претходната");
                }
                else
                {
                    using (var scope = new UnitOfWorkScope())
                    {
                        var user = _repository.GetUserByUsername(CurrentUser.UserName);
                        user.SetPassword(model.NewPassword.Md5String());

                        scope.Commit();
                    }
                    succeed = true;
                    this.ShowMessage(MessageType.Success, "Лозинката е успешно променета.", true);
                }
            }

            model.UserName = CurrentUser.UserName;
            model.FirstName = CurrentUser.FirstName;
            model.LastName = CurrentUser.LastName;
            //var backendUser = CurrentUser as BackendUser;
            //if (backendUser != null)
            //{
            //    model.Institution = ResourceManager.GetMultilangValue(backendUser.Institution.Name);
            //}

            //if (CurrentUser.CertificateRawBytes != null)
            //{
            //    ViewBag.hasCertificate = CurrentUser.CertificateRawBytes.ToString();
            //    ViewBag.CertificateDateUntil = CurrentUser.CertificateDateUntil;
            //}
            //else
            //{
            //    ViewBag.hasCertificate = string.Empty;
            //}
            ViewBag.ChangePass = !succeed;
            return View("Profile", model);
        }

        [HttpGet]
        public ActionResult ForgotPassword()
        {
            return View("ForgotPassword");
        }

        [HttpPost]
        public ActionResult ForgotPassword(string username)
        {
            User user = _repository.GetUserByUsername(username);
            if (user == null)
            {
                throw new JsonException("Корисникот не е пронајден во системот.");
            }
            var appParametersRep = ServiceLocator.Current.GetInstance<IApplicationParameterRepository>();
            var applicationtRootUrl = appParametersRep.GetByName("ApplicationtRootUrl").ParameterValue;
            var sendForgotPasswordInformationViewModel = new SendForgotPasswordInformationViewModel
                                                             {
                                                                 FullName = user.FullName,
                                                                 RegistrationCode = user.RegistrationCode,
                                                                 To = user.UserName,
                                                                 ApplicationtRootUrl = applicationtRootUrl
                                                             };
            MailService.SendForgotPasswordInformation(sendForgotPasswordInformationViewModel);
            return Json(true);
        }

        [HttpGet]
        public ActionResult ForgotPasswordConfirmation(ForgetPasswordUserNameViewModel model)
        {
            return View("ForgotPasswordConfirmation", model);
        }

        [HttpPost]
        public ActionResult ForgotPasswordConfirmation(ForgotPasswordConfirmationViewModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    User user;
                    using (var scope = new UnitOfWorkScope())
                    {
                        user = _repository.GetAll().SingleOrDefault(x => x.RegistrationCode == model.UserName);
                        if (user == null)
                        {
                            throw new JsonException("Корисникот не е пронајден во системот.");
                        }
                        user.SetPassword(model.PasswordNew.Md5String());
                        _repository.Update(user);
                        scope.Commit();
                    }
                    return Json(true);
                }
                catch (Exception ex)
                {
                    if (ex is JsonException)
                    {
                        throw ex;
                    }

                    ModelState.AddModelError(string.Empty,
                                                  "Во моментов системот има технички проблеми.<br/>Обидете се повторно за некоја минута");
                    Log.Error(ex);

                }

            }

            throw base.CreateModelException(model);
        }

        [HttpGet]
        public ActionResult Logout()
        {
            Session.Abandon();
            FormsAuthentication.SignOut();
            return Redirect("~/");
        }

        public string RandomString(int size)
        {
            StringBuilder builder = new StringBuilder();
            Random random = new Random();
            char ch;
            for (int i = 0; i < size; i++)
            {
                ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                builder.Append(ch);
            }
            return builder.ToString();
        }

        [HttpGet]
        public ActionResult CaptchaImage(string prefix, bool noisy = true)
        {
            var rand = new Random((int)DateTime.Now.Ticks);
            //generate new question
            int a = rand.Next(10, 99);
            int b = rand.Next(0, 9);
            var captcha = string.Format("{0} + {1} = ?", a, b);

            //store answer
            Session["Captcha" + prefix] = a + b;

            //image stream
            FileContentResult img = null;

            using (var mem = new MemoryStream())
            using (var bmp = new Bitmap(130, 30))
            using (var gfx = Graphics.FromImage((Image)bmp))
            {
                gfx.TextRenderingHint = TextRenderingHint.ClearTypeGridFit;
                gfx.SmoothingMode = SmoothingMode.AntiAlias;
                gfx.FillRectangle(Brushes.White, new Rectangle(0, 0, bmp.Width, bmp.Height));

                //add noise
                if (noisy)
                {
                    int i, r, x, y;
                    var pen = new Pen(Color.Yellow);
                    for (i = 1; i < 10; i++)
                    {
                        pen.Color = Color.FromArgb(
                        (rand.Next(0, 255)),
                        (rand.Next(0, 255)),
                        (rand.Next(0, 255)));

                        r = rand.Next(0, (130 / 3));
                        x = rand.Next(0, 130);
                        y = rand.Next(0, 30);

                        gfx.DrawEllipse(pen, x - r, y - r, r, r);
                    }
                }

                //add question
                gfx.DrawString(captcha, new Font("Tahoma", 15), Brushes.Gray, 2, 3);

                //render as Jpeg
                bmp.Save(mem, System.Drawing.Imaging.ImageFormat.Jpeg);
                img = this.File(mem.GetBuffer(), "image/Jpeg");
            }

            return img;
        }

        ////gorjan
        //[HttpPost]
        //public JsonResult UploadCertificate(string UserName, string Signature)
        //{
        //    try
        //    {
        //        using (var scope = new UnitOfWorkScope())
        //        {
        //            var user = _repository.GetUserByUsername(UserName);

        //            if (user != null && !string.IsNullOrEmpty(Signature))
        //            {
        //                X509Certificate2 cert = Signature.GetCertificates()[0];

        //                var user2 = _repository.GetUserByCertHash(cert.GetCertHashString());

        //                if (user2 != null)
        //                {
        //                    return Json("1");
        //                }

        //                user.CertificateRawBytes = cert.GetRawCertData();
        //                user.CertificateHash = cert.GetCertHashString();
        //                user.CertificateDateUntil = DateTime.Parse(cert.GetExpirationDateString());
        //            }
        //            scope.Commit();
        //        }

        //        return Json("2");
        //    }
        //    catch (Exception ex)
        //    {
        //        Log.Error(ex);
        //        return Json("3");
        //    }
        //}

        //[HttpGet]
        //public ActionResult CertificateDownload(string username)
        //{
        //    var user = _repository.GetUserByUsername(username);
        //    if (user != null)
        //    {
        //        var certBytes = user.CertificateRawBytes;
        //        return File(certBytes, "application/x-x509-ca-cert", "Certificate.cer");
        //    }
        //    this.ShowMessage(MessageType.Error, "Грешка.Обидете се повторно", true);
        //    return RedirectToAction("Profile");
        //}

        [HttpGet]
        public string CheckUserName(string input)
        {
            var ifuser = _repository.GetUserByUsername(input);
            if (ifuser == null)
            {
                return "Available";
            }
            return "Not Available";
        }

        [HttpGet]
        public string CheckCaptcha(string input, string prefix)
        {
            if (Session["Captcha" + prefix].ToString() != input)
            {
                return "Bad";
            }
            return "Good";
        }
    }
}
