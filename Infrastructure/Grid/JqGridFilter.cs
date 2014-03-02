using System.IO;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text;

namespace EBills.Infrastructure.Grid
{
    [DataContract]
    public class JqGridFilter
    {
        [DataMember(Name = "groupOp")]
        public string GroupOp { get; set; }

        [DataMember(Name = "rules")]
        public JqGridRule[] Rules { get; set; }

        public static JqGridFilter Create(string jsonData)
        {
            try
            {
                var serializer = new DataContractJsonSerializer(typeof(JqGridFilter));
                var ms = new MemoryStream(Encoding.UTF8.GetBytes(jsonData));
                return serializer.ReadObject(ms) as JqGridFilter;
            }
            catch
            {
                return null;
            }
        }

        public string GetFieldValue(string fieldName)
        {
            if (Rules == null)
                return null;

            if (string.IsNullOrEmpty(fieldName))
                return null;

            JqGridRule temp = null;


            // ReSharper disable LoopCanBeConvertedToQuery
            foreach (JqGridRule r in Rules)
            // ReSharper restore LoopCanBeConvertedToQuery
            {
                if (!string.IsNullOrEmpty(r.Field))
                {
                    if (r.Field.Equals(fieldName))
                    {
                        temp = r;
                        break;
                    }
                }
            }

            return temp != null ? temp.Data : null;
        }


    }
}