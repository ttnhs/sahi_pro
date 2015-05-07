package in.co.sahi;

import java.awt.Component;
import java.awt.Window;

import junit.framework.TestCase;
import net.sf.sahi.client.Browser;
import net.sf.sahi.client.ExecutionException;
import net.sf.sahi.config.Configuration;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.KeyEvent;
import java.awt.Robot;

import javax.xml.transform.Source;

import sun.awt.AWTAccessor.KeyEventAccessor;


/**
 * 
 * This is a sample class to get started with Sahi Java.<br/> 
 * Have a look at DriverClientTest.java in sample_java_project dir for more detailed use of APIs.<br/>
 * You need sahi/lib/sahi.jar in your classpath.</br>
 * 
 */
public class JavaClientTest extends TestCase implements KeyEventAccessor{
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

		b = new Browser("safari");	
		b.open();
	}	
	
	/*public void testGoogle() throws ExecutionException{
		b.navigateTo("http://www.google.com");
		b.textbox("q").setValue("sahi forums");
		b.submit("Google Search").click();
		b.waitFor(1000);
		b.link("Forums - Sahi - Web Automation and Test Tool").click();		
		b.link("Login").click();
		System.out.println(":: b.textbox(\"req_username\").exists() = " + b.textbox("req_username").exists());
	}*/

	
	/*public void testSahiDemoSite(){
		b.navigateTo("http://sahi.co.in/demo/training/");
		b.textbox("user").setValue("test");
		b.password("password").setValue("secret");
		b.submit("Login").click();
		b.textbox("q").setValue("2");
		b.textbox("q[1]").setValue("9");
		b.textbox("q[2]").setValue("4");
		b.button("Add").click();	
		System.out.println(":: b.textbox(\"total\").value()=" + b.textbox("total").value());
	}*/
	
	/*public void testQAMoodleSite(){
		b.navigateTo("http://qa.moodle.net/");
//		b.label("Username").click();
//		b.textbox("username").setValue("manager");
//		b.password("password").setValue("test");
		b.byXPath("//*[@id='login_username']").setValue("manager");
		b.byXPath("//*[@id='login_password']").setValue("test");
//		b.div("c1 btn").click();
//		b.submit("Log in").click();
		b.byXPath("//*[@value='Log in']").click();
//		b.span("My profile settings").click();
		b.span("Site administration").click();
		b.span("Users").click();
		b.paragraph("expandable_branch_13").click();
		b.span("Browse list of users").click();
		b.link("2").click();
		b.link("Student 26").click();
		b.span("userbutton").click();
		b.link("Log out").click();
		System.out.println("Done");
	}*/
	
	/*public void testQAMoodleUploadUsers(){
		
		try {
			Robot robot = new Robot();
			b.navigateTo("http://qa.moodle.net/");
			b.textbox("username").setValue("manager");
			b.password("password").setValue("test");
			b.submit("Log in").click();
			b.span("Site administration").click();
			b.span("Users").click();
			b.span("Accounts").click();
			b.span("Upload users").click();
			b.waitFor(4000);
			b.button("Choose a file...").click();
			b.waitFor(4000);
			b.span("Upload a file").click();
			b.waitFor("_assert(_isVisible(_file(\"repo_upload_file\"))", 4000);
			b.focusWindow();
			b.waitFor(4000);
			b.focus(b.file("repo_upload_file"));
			b.wait(4000);
			Button a = new Button("click");
		    KeyEvent e;
		    e = new KeyEvent(a, 1, 20, 1, 10, 'a');
		    System.out.println(""+e.getKeyChar());
		    System.out.println(""+e.getKeyCode());
			b.textbox("title").setValue("validUsers");
			b.waitFor(500);
			b.submit("Upload this file").click();
			b.waitFor(500);
			b.submit("Upload users").click();
			b.waitFor(500);
			b.link("Collapse all").click();
			b.waitFor(500);
			b.submit("Upload users").click();
			b.waitFor(500);
			b.submit("Continue").click();
			//b.waitFor("_sahi._isVisible(_sahi._button(\"Choose a file\"))", 10000);
			b.navigateTo("http://qa.moodle.net/");
			b.textbox("username").setValue("manager");
			b.password("password").setValue("test");
			b.submit("Log in").click();
			b.span("My home[1]").click();
			b.span("Site administration").click();
			b.span("Users").click();
			b.span("Accounts").click();
			b.span("Upload users").click();
			
			b.button("Choose a file...").click();
			b.waitFor("_sahi._isVisible(_sahi._button(\"Upload a file\"))", 10000);
			b.span("Upload a file").click();
			b.waitFor("_sahi._isVisible(_sahi._file(\"repo_upload_file\"))", 10000);

			b.file("repo_upload_file").setFile("");
			
			b.file("repo_upload_file").setFile("userList.csv");
			
			b.textbox("title").setValue("vallidUsers");
			
			b.submit("Upload this file").click();
			
			b.submit("Upload users").click();
			
			b.link("Collapse all").click();
			b.submit("Upload users").click();
			b.submit("Continue").click();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}*/
	
	/*public void testOpenNewTab(){
		b.navigateTo("http://qa.moodle.net/");
		b.textbox("username").setValue("manager");
		b.password("password").setValue("test");
		b.submit("Log in").click();
//		b.rightClick(b.span("My home[1]"));
//		b.keyPress(b.span("My home[1]"), "DOWN ARROW", "CTRL");
//		
		b.waitFor(10000);
		b.keyDown(b.link("My home[1]"), "ENTER", "CRTL|SHIFT");
		b.waitFor(2000);
//		b.keyUp(b.span("My home[1]"),  "ENTER", "CRTL|SHIFT");
//		b.span("My home[1]").click();
//		b.link("Turn editing on").click();
	}*/
	
	public void testKeyEvent(){
		Button a = new Button("click");
	    KeyEvent e;
	    e = new KeyEvent(a, 1, 20, 1, 10, 'a');
	    System.out.println(""+e.getKeyChar());
	    System.out.println(""+e.getKeyCode());
	}
	
	/**
	 * This closes the browser instance, stops the proxy and toggles back the IE proxy settings.
	 * This could be part of your JUnit tearDown.
	 */
	
	public void tearDown(){
		b.close();		
	}

	@Override
	public void setExtendedKeyCode(KeyEvent arg0, long arg1) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setPrimaryLevelUnicode(KeyEvent arg0, long arg1) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setRawCode(KeyEvent arg0, long arg1) {
		// TODO Auto-generated method stub
		
	}
		
}
