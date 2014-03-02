
using Nextsense.Infrastructure.Data;
using System.Collections.Generic;

namespace EBills.Domain.Data
{
    /// <summary>
    /// Интерфејс за repository на апликациски параметар
    /// </summary>
    public interface IApplicationParameterRepository : IRepository<ApplicationParameter>
    {
        /// <summary>
        /// Метод за добивање на сите валидни апликациски параметри
        /// </summary>
        /// <returns>Листа на апликациски параметри</returns>
        IEnumerable<ApplicationParameter> GetAllValid();
        /// <summary>
        /// Метод за добивање на сите апликациски вредности за даден параметар
        /// </summary>
        /// <returns>Листа на апликациски параметри</returns>
        IEnumerable<ApplicationParameter> GetAllForParameterName(string parameterName);

        /// <summary>
        /// Метод за добивање на сите валидни апликациски параметри
        /// </summary>
        /// <returns>Листа на апликациски параметри</returns>
        ApplicationParameter GetByName(string parameterName);
    }
}
