
using System.Collections.Generic;
using System.Security.Cryptography.X509Certificates;
using System.Security.Cryptography.Xml;
using System.Xml;

namespace EBills.Infrastructure.Helpers
{
    public static class CertHelpers
    {
        public static List<X509Certificate2> GetCertificates(this string envelopedSignature)
        {
            XmlDocument document = new XmlDocument();

            try
            {
                document.LoadXml(envelopedSignature);
                return document.GetCertificates();
            }
            catch
            {
                return new List<X509Certificate2>();
            }
        }

        public static List<X509Certificate2> GetCertificates(this XmlDocument envelopedSignature)
        {
            XmlNamespaceManager mgr = new XmlNamespaceManager(envelopedSignature.NameTable);
            mgr.AddNamespace("digsig", @"http://www.w3.org/2000/09/xmldsig#");

            XmlNodeList signatures = envelopedSignature.DocumentElement.SelectNodes("digsig:Signature", mgr);

            if (signatures.Count == 0) return new List<X509Certificate2>();

            foreach (XmlNode signature in signatures)
            {
                envelopedSignature.DocumentElement.RemoveChild(signature);
            }

            List<X509Certificate2> certificates = new List<X509Certificate2>();

            foreach (XmlNode xsignature in signatures)
            {
                Signature signature = new Signature();
                XmlElement elem = (xsignature as XmlElement);
                signature.LoadXml(elem);

                foreach (KeyInfoClause kc in signature.KeyInfo)
                {
                    if (kc is KeyInfoX509Data)
                    {
                        KeyInfoX509Data certData = (kc as KeyInfoX509Data);
                        foreach (X509Certificate2 c in certData.Certificates)
                        {
                            certificates.Add(c);
                        }
                    }
                }
            }

            return certificates;
        }

        public static bool VerifyDigitalSignature(this string envelopedSignature)
        {
            XmlDocument document = new XmlDocument();

            try
            {
                document.LoadXml(envelopedSignature);
                return document.VerifyDigitalSignature();
            }
            catch
            {
                return false;
            }
        }

        public static bool VerifyDigitalSignature(this XmlDocument envelopedSignature)
        {
            XmlNamespaceManager mgr = new XmlNamespaceManager(envelopedSignature.NameTable);
            mgr.AddNamespace("digsig", @"http://www.w3.org/2000/09/xmldsig#");

            XmlNodeList signatures = envelopedSignature.DocumentElement.SelectNodes("digsig:Signature", mgr);

            if (signatures.Count == 0) return false;

            foreach (XmlNode signature in signatures)
            {
                envelopedSignature.DocumentElement.RemoveChild(signature);
            }

            foreach (XmlNode signature in signatures)
            {
                //if (!XmlDigitalSignatures.CheckDetachedSignature(envelopedSignature.OuterXml, signature.OuterXml)) return false;
            }

            return true;
        }
    }
}
