namespace EBills.Infrastructure.Grid
{
    public class JqGridModel
    {
        /// <summary>
        /// Broj na stranica
        /// </summary>
        public int Page { get; set; }

        /// <summary>
        /// Vkupno stranici
        /// </summary>
        public int Total { get; set; }

        /// <summary>
        /// Broj na stavki
        /// </summary>
        public int Records { get; set; }

        /// <summary>
        /// Podatocite
        /// </summary>
        public object[] Rows { get; set; }
    }
}