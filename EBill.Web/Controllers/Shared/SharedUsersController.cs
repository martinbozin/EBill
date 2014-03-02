using EBills.Domain;
using EBills.Domain.Data;
using EBills.Infrastructure.Exceptions;
using EBills.Infrastructure.Extensions;
using EBills.Infrastructure.Helpers;
using EBills.Security;
using EBills.Web.Controllers.Shared.Base;

using Nextsense.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using EBills.Web.ViewModels.Mail;

namespace EBills.Web.Controllers.Shared
{
    /// <summary>
    /// Тука ке стојат функции кои се заеднички за
    /// сите зони
    /// </summary>
    [Authorize]
    public class SharedUsersController : AppControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        public SharedUsersController(IUserRepository userRepository, IRoleRepository roleRepository)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
        }

        /// <summary>
        /// Ресетирање на лозника
        /// </summary>
        /// <param name="userId">ИД на корисникот</param>
        /// <returns></returns>

        [HttpPost]
        //[CustomAuthorize(AuthorizedRoles = new[] { Roles.MunicipalityAdministrator, Roles.ZelsAdministrator })]
        public JsonResult ResetPassword(int userId)
        {
            User user;
            //SendResetPasswordConfirmationViewModel sendResetPasswordConfirmationViewModel;

            using (var scope = new UnitOfWorkScope())
            {
                user = _userRepository.Get(userId);
                if (user == null)
                {
                    throw new JsonException("Корисникот не е пронајден во системот.");
                }

                string password = new PasswordGenerator().Generate();
                string passwordEnc = password.Md5String();

                user.SetPassword(passwordEnc);

                //sendResetPasswordConfirmationViewModel = new SendResetPasswordConfirmationViewModel
                //{
                //    FullName = user.FullName,
                //    Password = password
                //};

                _userRepository.Update(user);
                scope.Commit();
            }

            //sendResetPasswordConfirmationViewModel.To = user.UserName;
            //MailService.SendResetPasswordConfirmation(sendResetPasswordConfirmationViewModel);

            return Json(true);
        }

        /// <summary>
        /// Додавање на улоги за корисникот
        /// </summary>
        /// <param name="userId">ИД на корисникот</param>
        /// <param name="selectedRoles">ИД на улогите кои треба да се додадат. т.е. новата состојба</param>
        /// <returns></returns>

        [HttpPost]
        //[CustomAuthorize(AuthorizedRoles = new[] { Roles.MunicipalityAdministrator, Roles.ZelsAdministrator })]
        public JsonResult AddRoles(int userId, List<int> selectedRoles)
        {
            if (selectedRoles != null)
            {
                using (var scope = new UnitOfWorkScope())
                {
                    var user = _userRepository.Get(userId);
                    if (user == null)
                    {
                        throw new JsonException("Корисникот не е пронајден во системот.");
                    }
                    var roles = _roleRepository.GetAll();

                    //Remove Other Roles
                    var userRoles = user.Roles.Select(x => x.Id).ToList();
                    foreach (var roleId in userRoles)
                    {
                        if (selectedRoles.Contains(roleId))
                            continue;
                        var role = roles.First(x => x.Id == roleId);
                        user.Roles.Remove(role);
                    }

                    //Add new Roles 
                    foreach (var selectedRoleId in selectedRoles)
                    {
                        if (userRoles.Contains(selectedRoleId))
                            continue;
                        var role = roles.First(x => x.Id == selectedRoleId);
                        user.AddToRole(role);
                    }

                    _userRepository.Update(user);
                    scope.Commit();
                }
            }
            return Json(true);
        }
    }
}
