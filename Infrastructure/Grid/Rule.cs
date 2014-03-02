using System.Runtime.Serialization;

namespace EBills.Infrastructure.Grid {
    [DataContract]
    public class Rule {
        [DataMember(Name = "field")]
        public string Field { get; set; }

        [DataMember(Name = "op")]
        public string Op { get; set; }

        [DataMember(Name = "data")]
        public string Data { get; set; }
    }
}