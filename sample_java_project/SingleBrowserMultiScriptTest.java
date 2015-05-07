package net.sf.sahi.client;

import java.util.HashMap;
import java.util.Map;

import junit.framework.TestCase;

import net.sf.sahi.client.SingleBrowserMultiScriptHelper;

/**
 * This is a sample junit test used to demonstrate the usage of SingleBrowserMultiScriptHelper
 * to launch a browser and execute multiple scripts one after the other while waiting in between.
 */
public class SingleBrowserMultiScriptTest extends TestCase {
	private final static String sahiHost = "localhost";
	private final static String sahiPort = "9999";
	private final static String browserType = "firefox";
	private final static String userDataScriptsFolder = "C:/Users/ntumy/sahi_pro/userdata/scripts"; // Set this to your userdata/scripts location
	
	/**
	 * This is what you need!
	 */
	public void testSingleBrowserMultiScript() {
		// Create a SingleBrowserMultiScriptHelper object. A new object should be created for a full set
		// of openBrowser, executeScript, executeScript, executeScript..., killBrowser calls.
		SingleBrowserMultiScriptHelper helper = new SingleBrowserMultiScriptHelper(sahiHost, sahiPort, browserType);
		boolean opened = false;

		try {
			// Logging default script execution timeout.
			System.out.println(helper.getScriptExecutionTimeout());

			// Set the script execution timeout to 15 minutes. This applies for each script.
			// Depending on the duration of your scripts, adjust this time accordingly.
			helper.setScriptExecutionTimeout(15*60*1000); // 15 minutes

			// Log debug messages
			helper.setLogDebugMessages(true);

			// Launch the browser with a start url
			opened = helper.launchBrowser("http://sahi.co.in/demo/");

			if (!opened) {
				System.out.println("Failed to launch browser correctly. Tests will not proceed");
				return;
			}

			System.out.println("Browser opened");

			// Execute the script
			boolean success = helper.executeScript(userDataScriptsFolder, "demo/clickCombo.sah");

			// NOTE: If script fails, you may decide whether to move ahead or not depending upon the flow.
			if (!success) {
				System.out.println("Script 1 failed. Tests will not proceed");
				return;
			}

			System.out.println("Script1 success");

			// Randomly doing something between two scripts
			doSomethingElse();

			// Execute the second script
			success = helper.executeScript(userDataScriptsFolder, "demo/clicksTest.sah");

			if (!success) {
				System.out.println("Script 2 failed. Tests will not proceed");
				return;
			}

			System.out.println("Script2 success");

			doSomethingElse();

			// Execute the third script, by passing in parameters.
			Map<String, String> inputParams = new HashMap<String, String>();
			inputParams.put("user", "test");
			inputParams.put("password", "secret");			
			success = helper.executeScript(userDataScriptsFolder, "demo/sampleapp_with_params.sah", inputParams);

			if (!success) {
				System.out.println("Script 3 failed. Tests will not proceed");
				return;
			}

			System.out.println("Script3 success");
		}
		finally {
			if (opened) {
				// Kill the browser.
				helper.killBrowser();
			}
		}	
	}
	
	private static void doSomethingElse() {
		for (int i=0; i<5; ++i) {
			System.out.println("Doing something else");
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
}
