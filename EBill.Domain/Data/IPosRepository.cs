
using Nextsense.Infrastructure.Data;

namespace EBills.Domain.Data
{
    public interface IPosRepository : IRepository<Pos>
    {
        Pos GetPosByName(string username);
    }
}
