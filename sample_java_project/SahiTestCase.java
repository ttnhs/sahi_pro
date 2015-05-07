package net.sf.sahi.client;

/**
 * Copyright Tyto Software Pvt. Ltd.
 */


import junit.framework.TestCase;
import net.sf.sahi.Proxy;

public abstract class SahiTestCase extends TestCase {
	private static final long serialVersionUID = 9094239240720483156L;
	protected Browser b;
	protected Browser browser;
	protected Proxy proxy;
	protected boolean isProxyInSameProcess = false;
	protected String browserName; 	

	
	public abstract void setBrowser();
	
	public void setUp(){
		setBrowser();		
		b = new Browser(browserName);		
		browser = b;
		b.open();
	}

	public void tearDown(){
		b.setSpeed(100);
		b.close();		
	}
	
	public void setBrowser(String browserName){
		this.browserName = browserName;
	}	
}
