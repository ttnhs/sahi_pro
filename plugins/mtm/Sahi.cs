using System;
using System.Collections;
using System.Linq;
using System.Text;
using System.Threading;
using System.Collections.Generic;

//change namespace to your own solution
namespace SahiLibraryMtm
{
    public class Sahi
    {
        private String host = "localhost";
        private String port = "9999";

        public Sahi()
        {
        }

        public Sahi(String host, String port)
        {
            this.host = host;
            this.port = port;
        }
        public Boolean executeInParallel(String baseUrl, String browserType, String scriptPath)
        {
            Boolean result = executeSingle(baseUrl, browserType, "false", scriptPath, "5", "html", scriptPath);
            return result;
        }

        public Boolean executeSingle(String baseUrl, String browserType, String useSingleSession, String scriptPath, String threads, String logInfo, String suitePath)
        {
            String sessionId = Utils.generateId();
            String url = "http://localhost:9999/_s_/dyn/Suite_startInParallel?a=a" +
                    "&port=9999" +
                    "&useSingleSession=" + Utils.encode(useSingleSession) +
                    "&browserPath=null" +
                    "&host=localhost" +
                    "&test=" + Utils.encode(scriptPath) +
                    "&sahisid=" + Utils.encode(sessionId) +
                    "&suiteId=" + Utils.encode(sessionId) +
                    "&threads=" + Utils.encode(threads) +
                    "&logsInfo=" + Utils.encode(logInfo) +
                    "&suitePath=" + Utils.encode(suitePath) +
                    "&isSingleSessionS=" + Utils.encode(useSingleSession) +
                    "&baseURL=" + Utils.encode(baseUrl) +
                    "&browserType=" + Utils.encode(browserType);
            Utils.readURL(url); //the success or failure message 
            return getResult(sessionId, browserType);            
        }

        private Boolean getResult(string sessionId, string browserType)
        {
            String[] split = browserType.Split('+');
            Dictionary<String, String[]> statuses = new Dictionary<String, String[]>();
            for (int i = 0; i < split.Length; i++)
            {
                String browserSingle = split[i];
                String[] status = getStatus(sessionId, browserSingle);
                statuses.Add(browserSingle, status);
               
            }
            String result = "";
            Boolean passed = true;
            foreach (KeyValuePair<String, String[]> pair in statuses)
            {
                result += "\n" + pair.Key + ": " + string.Join(" : ", pair.Value);
                if (pair.Value[0] == "FAILURE") passed = false;
            }
            if (!passed)
            {
                throw new Exception(result);
            }
            return passed;
        }

        private String[] getStatus(String sessionId, String browserSingle)
        {
            String[] status;
            String message;
            int retries = 0;
            while (true)
            {
                Thread.Sleep(2000);
                message = getSuiteStatus(sessionId, browserSingle);
                status = message.Split(':');
                if ("SUCCESS" == (status[0]) || "FAILURE" == (status[0]))
                {
                    break;
                }
                else if ("RETRY" == (status[0]))
                {
                    if (retries++ == 10)
                    {
                        status[0] = "FAILURE";
                        break;
                    }
                }
            }
            return status;
        }

        private string getSuiteStatus(string sessionId, String browserSingle)
        {
            String status;
            String urlStr;
            
            try
            {
                urlStr = "http://" + host + ":" + port + "/_s_/dyn/Suite_getAllStatus?sahisid=" + Utils.encode(sessionId) + "&browserType=" + browserSingle;
                status = Utils.readURL(urlStr);
                
            }
            catch (Exception e)
            {
                Console.WriteLine(e.StackTrace);
                Console.WriteLine("Exception while connecting to Sahi proxy to check status. Retrying ...");
                status = "RETRY";
            }
            return status;
        }
    }
}
