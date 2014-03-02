using EBills.Data.NHibernate.NHibernate;
using EBills.Domain;
using EBills.Domain.Data;
using NHibernate.Linq;
using System.Linq;

namespace EBills.Data.NHibernate.Impl
{
    public class PosRepository : NHRepository<Pos>, IPosRepository
    {
        public Pos GetPosByName(string posName)
        {
            return
               Session.Query<Pos>()
               .FirstOrDefault(x => x.PosName == posName);
        }
    }
}
