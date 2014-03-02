
using System;

namespace EBills.Domain
{
    /// <summary>
    /// Апликациски параметар
    /// </summary>
    public class ApplicationParameter 
    {
        public virtual int Id { get; set; }
        
        /// <summary>
        /// Име на параметар
        /// </summary>
        public virtual string ParameterName { get; set; }

        /// <summary>
        /// Вредност на параметар
        /// </summary>
        public virtual string ParameterValue { get; set; }


        /// <summary>
        /// Податочен тип на параметар
        /// </summary>
        public virtual string ParameterType { get; set; }

        /// <summary>
        /// Датум на валидност на параметар
        /// </summary>
        public virtual DateTime? ParameterValidUntil { get; set; }
        /// <summary>
        /// Датум на валидност на параметар
        /// </summary>
        public virtual DateTime ParameterValidFrom { get; set; }

        /// <summary>
        /// Коментар за параметарот
        /// </summary>
        public virtual string ParameterDescription { get; set; }
    }
}
