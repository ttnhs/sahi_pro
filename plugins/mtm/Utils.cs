using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;

//change namespace to your own solution
namespace SahiLibraryMtm
{
    class Utils
    {
        public static String getUUID()
        {
            return System.Guid.NewGuid().ToString().Replace('-', '0');
        }

        public static String generateId()
        {
            return "sahi_" + getUUID();
        }
        public static String encode(String s)
        {
            if (s == null) return null;
            try
            {
                return Uri.EscapeDataString(s);
            }
            catch (ApplicationException)
            {
                return s;
            }
        }

        internal static String readURL(string url)
        {
            // Creates an HttpWebRequest with the specified URL. 
            HttpWebRequest myHttpWebRequest = (HttpWebRequest)WebRequest.Create(url);
            // Sends the HttpWebRequest and waits for the response.			
            HttpWebResponse myHttpWebResponse = (HttpWebResponse)myHttpWebRequest.GetResponse();
            // Gets the stream associated with the response.
            Stream receiveStream = myHttpWebResponse.GetResponseStream();
            Encoding encode = System.Text.Encoding.GetEncoding("utf-8");
            // Pipes the stream to a higher level stream reader with the required encoding format. 
            StreamReader readStream = new StreamReader(receiveStream, encode);

            Char[] read = new Char[256];

            // Read 256 charcters at a time.     
            int count = readStream.Read(read, 0, 256);

            String output = "";
            while (count > 0)
            {
                // Dump the 256 characters on a string and display the string onto the console.
                String str = new String(read, 0, count);
                output += str;
                count = readStream.Read(read, 0, 256);
            }
            //Console.WriteLine(str);
            
            // Releases the resources of the Stream.
            readStream.Close(); 
            myHttpWebResponse.Close();

            return output;
            
        
        }
    }
}
