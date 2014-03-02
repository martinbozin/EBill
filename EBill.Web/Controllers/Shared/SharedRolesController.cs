using EBills.Domain;
using EBills.Domain.Data;
using EBills.Web.Controllers.Shared.Base;
using EBills.Web.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace EBills.Web.Controllers.Shared
{
    /// <summary>
    /// Тука ке стојат функции кои се заеднички за
    /// сите зони
    /// </summary>
    [Authorize]
    public class SharedRolesController : AppControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        public SharedRolesController(IUserRepository userRepository,
            IRoleRepository roleRepository)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
        }


        /// <summary>
        /// Зема листа на улоги за даден корисник 
        /// </summary>
        /// <param name="userId">ИД на корисникот</param>
        /// <returns>Листа на улоги</returns>
        [HttpPost]
        public JsonResult GetRolesForUser(int userId)
        {
            var roles = _roleRepository
                .Query()
                .Where(x => x.Users.Any(z => z.Id == userId));

            List<RoleViewModel> list = roles
                                        .Select(role => new RoleViewModel
                                        {
                                            RoleId = role.Id,
                                            RoleName = role.RoleName,
                                            RoleNameTrans = role.RoleName
                                        })
                                        .ToList();
            return Json(list);
 
        }

        ///// <summary>
        ///// Зема листа на дозволени улоги за Амдинистратор 
        ///// во некоја општина или институција
        ///// </summary>
        ///// <returns>Листа на улоги</returns>
        [HttpPost]
        public JsonResult GetAllowedAdminRoles()
        {
            IQueryable<Role> query = null;
 
            var adminUser = CurrentUser;
            if (adminUser != null)
            {
               
                    query = _roleRepository.Query()
                                            .Where(x => x.RoleName == Roles.SuperAdmin
                                                || x.RoleName == Roles.Admin
                                                || x.RoleName == Roles.PublicUser
                                                );
            }

            if (query != null)
            {
                var roles = query.ToList();
                List<RoleViewModel> result = roles.Select(role => new RoleViewModel()
                                                                      {
                                                                          RoleId = role.Id,
                                                                          RoleName = role.RoleName,
                                                                          RoleNameTrans = role.RoleName
                                                                      }).ToList();

                return Json(result);
            }
            return Json(false);
        }
    }
}
