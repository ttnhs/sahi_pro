package in.co.sahi;

import java.awt.Window;

import junit.framework.TestCase;
import net.sf.sahi.client.Browser;
import net.sf.sahi.client.ExecutionException;
import net.sf.sahi.config.Configuration;

/**
 * 
 * This is a sample class to get started with Sahi Java.<br/> 
 * Have a look at DriverClientTest.java in sample_java_project dir for more detailed use of APIs.<br/>
 * You need sahi/lib/sahi.jar in your classpath.</br>
 * 
 */
public class MAN001 extends TestCase {
	private Browser b;
	private String userDataDirectory;

	/**
	 * This starts the Sahi proxy, toggles the proxy settings on Internet Explorer
	 * and starts a browser instance. This could be part of your setUp method in a JUnit test.
	 * 
	 */
	public void setUp(){
		String sahiBase = "C:/Users/ntumy/sahi_pro/"; // where Sahi is installed or unzipped
		userDataDirectory = "userdata"; 
		Configuration.initJava(sahiBase, userDataDirectory); // Sets up configuration for proxy. Sets Controller to java mode.

		b = new Browser("firefox");	
		b.open();
	}	
	
	
	public void browseListOfUsers(){
		b.navigateTo("http://qa.moodle.net/");
		b.textbox("username").setValue("manager");
		b.password("password").setValue("test");
		b.submit("Log in").click();
	}
	
	
	/**
	 * This closes the browser instance, stops the proxy and toggles back the IE proxy settings.
	 * This could be part of your JUnit tearDown.
	 */
	
	public void tearDown(){
		b.close();		
	}
		
}
