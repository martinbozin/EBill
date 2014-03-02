using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace EBills.Infrastructure.Grid
{
    [ModelBinder(typeof(GridModelBinder))]
    public class GridSettings
    {
        //IN
        public bool IsSearch { get; set; }
        public int PageSize { get; set; }
        public int PageIndex { get; set; }
        public string SortColumn { get; set; }
        public string SortOrder { get; set; }
        public JqGridFilter Where { get; set; }

        //OUT
        //se koristi za da go vrati brojot na rezultati od prebaruvanjeto
        public int Totalrecords { get; set; }

        //METHODS
        public void AddRule(JqGridRule rule)
        {
            if (Where == null)
                Where = new JqGridFilter();
            List<JqGridRule> rules = Where.Rules == null ? new List<JqGridRule>() : Where.Rules.ToList();
            rules.Add(rule);
            Where.Rules = rules.ToArray();
        }

        public void RemoveRuleByName(string name)
        {
            if (Where == null)
                Where = new JqGridFilter();
            List<JqGridRule> rules = Where.Rules == null ? new List<JqGridRule>() : Where.Rules.ToList();
            JqGridRule ruleToRemove = rules.FirstOrDefault(jqGridRule => jqGridRule.Field.Equals(name));
            if (ruleToRemove != null)
                rules.Remove(ruleToRemove);

            Where.Rules = rules.ToArray();
        }
    }
}