using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Mvc;
using System.Web.Optimization;

namespace EBills.Infrastructure.MVC
{
    public static class HtmlHelpers
    {
        public static MvcHtmlString MyScriptRender(this HtmlHelper helper, string path, string resVersion)
        {
            try
            {
                var sb = new StringBuilder();
                var theScripts = Scripts.Render(path).ToString();

                MatchCollection scriptBlocks = Regex.Matches(theScripts, "<script.*?<" + "/script>", RegexOptions.IgnoreCase | RegexOptions.Singleline);
                foreach (var scriptBlock in scriptBlocks)
                {
                    var script = scriptBlock.ToString();
                    script = script.Replace(".js", string.Format(".js?{0}", resVersion));
                    sb.AppendLine(script);
                }

                return MvcHtmlString.Create(sb.ToString());
            }
            catch (Exception)
            {
                var theScripts = Scripts.Render(path).ToString();
                return MvcHtmlString.Create(theScripts);
            }
        }
    }
}
