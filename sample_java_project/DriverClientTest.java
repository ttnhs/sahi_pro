package net.sf.sahi.client;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;

/**
 * Copyright Tyto Software Pvt. Ltd.
 */
/**
 * This is a sample junit test used to demonstrate various 
 * apis of Sahi.
 * You need sahi/lib/sahi.jar in your classpath
 * 
 */
public class DriverClientTest extends SahiTestCase {
//	protected String baseURL = "http://gramam";
	protected String baseURL = "http://sahipro.com";
	private static final long serialVersionUID = 5492057299341976253L;
	
	public void xtestZK(){
		b.setSpeed(210);
		b.navigateTo("http://www.zkoss.org/zkdemo/userguide/");
		b.div("Hello World").click();
		b.span("Pure Java").click();
		b.div("Various Form").click();
//		BrowserCondition condition = new BrowserCondition(browser){@Override
//			public boolean test() {
//				return b.textbox("z-intbox[1]").isVisible();
//			}};
//		b.waitFor(condition, 5000);
		assertTrue(b.textbox("z-intbox[1]").isVisible());
		b.div("Comboboxes").click();
		b.textbox("z-combobox-inp").setValue("aa");
		b.italic("z-combobox-btn").click();
		b.cell("Simple and Rich").click();
		b.italic("z-combobox-btn[1]").click();
		b.span("The coolest technology").click();
		b.italic("z-combobox-btn[2]").click();
		b.image("CogwheelEye-32x32.gif").click();
		assertTrue(b.textbox("z-combobox-inp[2]").exists());		
	}
	
	public void testOpen(){
		b.navigateTo(baseURL + "/demo/formTest.htm");
		b.textbox("t1").setValue("aaa");			
		b.link("Back").click();
		b.link("Table Test").click();		
		assertEquals("Cell with id", b.cell("CellWithId").getText());
	}
	
	public void testGetwin_simple() throws InterruptedException{
		b.navigateTo(baseURL + "/demo/");
		b.waitFor(2000);
		final List<HashMap<String, String>> windows = b.getWindows();
		assertEquals(1, windows.size());
		assertEquals("0", windows.get(0).get("wasOpened"));
		assertEquals("Sahi Tests", windows.get(0).get("windowTitle"));
	}
	
	public void testGetOptionTexts() throws Exception {
		b.navigateTo(baseURL + "/demo/selectTest.htm");
		String[] list = b.getOptions(b.select("s1"));
		assertEquals("--SELECT--", list[0]);
		assertEquals("Business Phone", list[1]);
		assertEquals("Cell Phone", list[2]);
		assertEquals("Email", list[3]);
		assertEquals("Fax", list[4]);
		assertEquals("Home Phone", list[5]);
		assertEquals("Mail", list[6]);
		assertEquals(7, list.length);
	}
	public void testGetUserAgent()throws Exception{
		b.navigateTo(baseURL + "/demo/tableTest.htm");
		assertEquals(b.getUserAgent(), b.fetch("navigator.userAgent"));
		
	}
	public void testGetScreenSize()throws Exception{
		b.resizeWindow(800,400);
		b.navigateTo(baseURL + "/demo/");
		int screensize[]=b.getScreenSize();
		System.out.println(screensize[0]);
		System.out.println(screensize[1]);
		assertTrue((screensize[0]>=783) &&(screensize[0]<800));
		assertTrue((screensize[1]>=280) &&(screensize[1]<400));
		
	}
	public void testGetTableContents()throws Exception{
		b.navigateTo(baseURL + "/demo/tableTest.htm");
		String[][] list1 = b.getTableContents(b.table("t2"));
		String[][] list2 = new String[][]{
				{"Item","Price","Number"},
				{"Tooth brush","Rs. 20","3"},
				{"Soap","Rs. 18","4"}
		};
		for(int i=0;i<list1.length;i++){
				for(int j=0;j<list1[i].length;j++){
					assertEquals(list1[i][j], list2[i][j]);
				}
		}
		Object[] input={"Price","/It.*/",1};
		//int input[]=new int[]{1,2};
		
		list1 = b.getTableContents(b.table("t2"),input);
		list2 = new String[][]{
				{"Price","Item","Price"},
				{"Rs. 20","Tooth brush","Rs. 20"},
				{"Rs. 18","Soap","Rs. 18"}
		};
		for(int i=0;i<list1.length;i++){
			for(int j=0;j<list1[i].length;j++){
				assertEquals(list1[i][j], list2[i][j]);
			}
		}
		//_getTableContents(_table("t4"),[0,1],"/.*E10.*/",10);
		list1= b.getTableContents(b.table("t4"),new int[]{0,1},"/.*E10.*/",10);
		list2= new String[][]{
				{"E101","Steven"},
				{"E102","Neena"},
				{"E103","Allan"},
				{"E101","Bob"},
		};
		for(int i=0;i<list1.length;i++){
			for(int j=0;j<list1[i].length;j++){
				assertEquals(list1[i][j], list2[i][j]);
			}
		}
		b.navigateTo(baseURL + "/demo/tableTest.htm");
		// _getTableContents(_table("t4"),[1,2,"EMAIL"],5,10);
		list1= b.getTableContents(b.table("t4"),new Object[]{1,2,"EMAIL"},5,10);
		list2= new String[][]{
				{"Avdesh","Baghel","avdesh.baghel"},
				{"Harish","Kumar","harish.kumar@gmail.com"},
				{"Bob","Wattson","bob.wattson@gmail.com"},
		};
		for(int i=0;i<list1.length;i++){
			for(int j=0;j<list1[i].length;j++){
				assertEquals(list1[i][j], list2[i][j]);
			}
		}
		b.navigateTo(baseURL + "/demo/tableTest.htm");
		// _getTableContents(_table("t4"),[0,"/.*_ID.*/","/.*_NU.*/"],1,5);
		list1= b.getTableContents(b.table("t4"),new Object[]{0,"/.*_ID.*/","/.*_NU.*/"},1,5);
		list2= new String[][]{
				{"E101","Dev12","987123"},
				{"E102","Dev14","425323"},
				{"E103","Dev18","654124"},
				{"E201","Dev14","562452"},
		};
		for(int i=0;i<list1.length;i++){
			for(int j=0;j<list1[i].length;j++){
				assertEquals(list1[i][j], list2[i][j]);
			}
		}
	}
	public void testGetOptionTextsES() throws Exception {
		b.navigateTo(baseURL + "/demo/selectTest.htm");
		String[] list = b.select("s1").getOptions();
		assertEquals("--SELECT--", list[0]);
		assertEquals("Business Phone", list[1]);
		assertEquals("Cell Phone", list[2]);
		assertEquals("Email", list[3]);
		assertEquals("Fax", list[4]);
		assertEquals("Home Phone", list[5]);
		assertEquals("Mail", list[6]);
		assertEquals(7, list.length);
	}
	
	public void testGetOptionsAsArray() throws Exception {
		b.navigateTo(baseURL + "/demo/selectTest.htm");
		String[] list1 = new String[]{"--SELECT--", "Business Phone", "Cell Phone", "Email", "Fax", "Home Phone", "Mail"};
		String[] list2 = b.getOptions(b.select("s1"));
		for (int i = 0; i < list2.length; i++) {
			assertEquals(list1[i], list2[i]);
		}
	}
	
	public void testGetOptionValues() throws Exception {
		b.navigateTo(baseURL + "/demo/selectTest.htm");
		String[] list = b.getOptions(b.select("s1"),"value");
		assertEquals("-1", list[0]);
		assertEquals("46", list[1]);
		assertEquals("47", list[2]);
		assertEquals("48", list[3]);
		assertEquals("49", list[4]);
		assertEquals("51", list[5]);
		assertEquals("50", list[6]);
	}
	
	public void testGetOptionValuesES() throws Exception {
		b.navigateTo(baseURL + "/demo/selectTest.htm");
		String[] list = b.select("s1").getOptions("value");
		assertEquals("-1", list[0]);
		assertEquals("46", list[1]);
		assertEquals("47", list[2]);
		assertEquals("48", list[3]);
		assertEquals("49", list[4]);
		assertEquals("51", list[5]);
		assertEquals("50", list[6]);
	}
	
	
	public void testGetwin_popupWithTitle() throws InterruptedException{
		b.navigateTo(baseURL + "/demo/");
		b.link("Window Open Test With Title").click();
		b.waitFor(3000);
		final List<HashMap<String, String>> windows = b.getWindows();
		assertEquals(2, windows.size());
		assertEquals("1", windows.get(1).get("wasOpened"));
		assertEquals("With Title", windows.get(1).get("windowTitle"));
	}
	
	public void testGetwin_popupWithoutTitle() throws InterruptedException{
		b.navigateTo(baseURL + "/demo/");
		b.link("Window Open Test").click();
		b.waitFor(3000);
		final List<HashMap<String, String>> windows = b.getWindows();
		assertEquals(2, windows.size());
		assertEquals("1", windows.get(1).get("wasOpened"));
		assertEquals("", windows.get(1).get("windowTitle"));
	}
	
	public void testGetwin_popupWithParam() throws InterruptedException{
        b.navigateTo(baseURL + "/demo/");
        b.link("Window Open Test").click();
        b.popup("popWin").close();
        b.waitFor(3000);
        final List<HashMap<String, String>> windows = b.getWindows();
        final List<HashMap<String, String>> windows2 = b.getWindows(0);
        final List<HashMap<String, String>> windows3 = b.getWindows(2000);
        assertEquals(2, windows.size());
        assertEquals(2, windows2.size());
        assertEquals(1, windows3.size());
	}
	
	public void testVerifyLayout(){
		b.openWindow("http://sahi.co.in/demo/training/", "defaultSahiPopup", 550, 550);
		//System.out.println(System.getProperty("user.dir"));
		//System.out.println(b.readLayoutFile("userdata/scripts/layout/550,550.txt"));
//		String fileContents = Utils.readFileAsString("userdata/scripts/layout/java.txt");
//		String lines[] = fileContents.replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n");		
		List<List<ElementStub>> csvList = new ArrayList<List<ElementStub>>();
		List<ElementStub> row = new ArrayList<ElementStub>();
		row.add(b.cell("Username"));
		row.add(b.textbox("user"));
		csvList.add(row);
//		for (int i=0; i<lines.length; i++){
//			String linePieces[] = lines[i].split(",");
//			
//			List<ElementStub> csvPieces = new ArrayList<ElementStub>(linePieces.length);
//			for(int j=0; j<linePieces.length; j++){
//				ElementStub el = new ElementStub(linePieces[j], browser);
//				//ElementStub el2 = "b.div(\"\")";
//				System.out.println(el);
//				csvPieces.add(el);
//			}
//			csvList.add(csvPieces);
//		}
		assertTrue(b.popup("defaultSahiPopup").verifyLayout(csvList, 4));
	}

	public void testFetch() throws Exception {
		b.navigateTo(baseURL + "/demo/formTest.htm");
		assertEquals(baseURL + "/demo/formTest.htm", b.fetch("window.location.href"));
		
	}
	
	public void testDragDrop(){
		b.navigateTo(baseURL + "/demo/dragDropMooTools.htm");
		b.div("Drag me").dragAndDropOn(b.xy(b.div("Item 2"), 5, 5));
//		b.waitFor(3000);
		assertTrue(b.div("dropped").exists());
		b.waitFor(3000);		
		b.div("Item 1").exists();
		b.div("Item 3").exists();
		b.div("Item 4").exists();
	}
	
	public void testSettingAndGettingSelectionText() {
		b.navigateTo(baseURL + "/demo/");
		b.click(b.link("Form Test"));
		b.setValue(b.textarea("ta1"), "abcdefgh");
		b.selectRange(b.textarea("ta1"), 2, 4);
		String value = b.getSelectionText();
		assertEquals("cd", value);
		b.navigateTo(baseURL + "/demo/", true);
		b.click(b.link("IFrames Test"));
		b.click(b.link("Form Test"));
		b.setValue(b.textarea("ta1"), "abcdefgh");
		b.selectRange(b.textarea("ta1"), 2, 4);
		String value2 = b.getSelectionText();
		assertEquals("cd", value2);
	}
	
	public void testSahiDemoAccessors(){
		b.navigateTo(baseURL + "/demo/formTest.htm");
		assertEquals("", b.textbox("t1").value());
		assertNotNull(b.textbox(1));
		assertNotNull(b.textbox("$a_dollar"));
		b.textbox("$a_dollar").setValue("adas");
		assertEquals("", b.textbox(1).value());
		assertNotNull(b.textarea("ta1"));
		assertEquals("", b.textarea("ta1").value());
		assertNotNull(b.textarea(1));
		assertEquals("", b.textarea(1).value());
		assertNotNull(b.checkbox("c1"));
		assertEquals("cv1", b.checkbox("c1").value());
		assertNotNull(b.checkbox(1));
		assertEquals("cv2", b.checkbox(1).value());
		assertNotNull(b.checkbox("c1[1]"));
		assertEquals("cv3", b.checkbox("c1[1]").value());
		assertNotNull(b.checkbox(3));
		assertEquals("", b.checkbox(3).value());
		assertNotNull(b.radio("r1"));
		assertEquals("rv1", b.radio("r1").value());
		assertNotNull(b.password("p1"));
		assertEquals("", b.password("p1").value());
		assertNotNull(b.password(1));
		assertEquals("", b.password(1).value());
		assertNotNull(b.select("s1"));
		assertEquals("o1", b.select("s1").selectedText());
		assertNotNull(b.select("s1Id[1]"));
		assertEquals("o1", b.select("s1Id[1]").selectedText());
		assertNotNull(b.select(2));
		assertEquals("o1", b.select(2).selectedText());
		assertNotNull(b.button("button value"));
		assertNotNull(b.button("btnName[1]"));
		assertNotNull(b.button("btnId[2]"));
		assertNotNull(b.button(3));
		assertNotNull(b.submit("Add"));
		assertNotNull(b.submit("submitBtnName[1]"));
		assertNotNull(b.submit("submitBtnId[2]").fetch());
		assertNotNull(b.submit(3).fetch());
		assertNotNull(b.image("imageAlt1").fetch());
		assertNotNull(b.image("imageId1[1]").fetch());
		assertNotNull(b.image(2).fetch());
		assertNull(b.link("Back22").fetch());
		assertNotNull(b.link("Back").fetch());
		assertNotNull(b.accessor("document.getElementById('ta1')"));
		assertNotNull(b.byId("ta1"));
		assertNotNull(b.byClassName("button[1]", "INPUT"));
		b.navigateTo("tableTest.htm");
		assertNotNull(b.byXPath("//table[1]/tbody/tr[1]/td[@id='CellWithId']"));
	}
	
	public void testSelect(){
		b.navigateTo(baseURL + "/demo/formTest.htm");
		assertEquals("o1", b.select("s1Id[1]").selectedText());
		b.select("s1Id[1]").choose("o2");
		assertEquals("o2", b.select("s1Id[1]").selectedText());
	}
	
	public void testMultiSelect(){
		b.navigateTo(baseURL + "/demo/selectTest.htm");
		b.select("s4Id").choose("o1");
		assertEquals("o1", b.select("s4Id").selectedText());
		b.select("s4Id").choose("o2", true);
		assertEquals("o1,o2", b.select("s4Id").selectedText());
		b.select("s4Id").choose(new String[]{"o2", "o3"});
		assertEquals("o2,o3", b.select("s4Id").selectedText());
		b.select("s4Id").choose(new String[]{"o1", "o2"}, true);
		assertEquals("o1,o2,o3", b.select("s4Id").selectedText());
	}	
	
	public void testSetFile(){
		b.navigateTo(baseURL + "/demo/php/fileUpload.htm");
		b.file("file").setFile("scripts/demo/uploadme.txt");
		b.submit("Submit Single").click();
		assertTrue(b.span("size").exists());
		assertTrue(b.span("size").text().indexOf("0.3046875 Kb") != -1);
		assertTrue(b.span("type").text().indexOf("Single") != -1);
		b.link("Back to form").click();
	}
	
	public void testSetFile2(){
		b.navigateTo(baseURL + "/demo/php/fileUpload.htm");
		b.file("file").setFile2("scripts/demo/uploadme.txt");
		b.submit("Submit Single").click();
		assertTrue(b.span("size").exists());
		assertTrue(b.span("size").text().indexOf("0.3046875 Kb") != -1);
		assertTrue(b.span("type").text().indexOf("Single") != -1);
		b.link("Back to form").click();
	}
	
	public void testFileSingleWith3rdParamAsRegex(){
		b.navigateTo(baseURL +"/demo/php/fileUpload.htm");	
		b.setFile(b.file("file4"), "scripts/demo/uploadme.txt", "/.*file.*php.*/");
		b.click(b.submit("Submit Single"));
		b.exists(b.span("size"));
		b.containsText(b.span("size"), "0.3046875 Kb");
		b.containsText(b.span("type"), "Single");
		
		b.navigateTo(baseURL +"/demo/php/fileUpload.htm");	
		b.file("file4").setFile("scripts/demo/uploadme.txt", "/.*file.*php.*/");
		b.click(b.submit("Submit Single"));
		b.exists(b.span("size"));
		b.containsText(b.span("size"), "0.3046875 Kb");
		b.containsText(b.span("type"), "Single");
	}
	

	public void testFileSingleWith3rdParamWithSetFile2(){
		b.navigateTo(baseURL +"/demo/php/fileUpload.htm");	
		b.setFile2(b.file("file4"), "scripts/demo/uploadme.txt", "fileUpload.php");
		b.click(b.submit("Submit Single"));
		b.exists(b.span("size"));
		b.containsText(b.span("size"), "0.3046875 Kb");
		b.containsText(b.span("type"), "Single");
		
		b.navigateTo(baseURL +"/demo/php/fileUpload.htm");	
		b.file("file4").setFile2( "scripts/demo/uploadme.txt", "fileUpload.php");
		b.click(b.submit("Submit Single"));
		b.exists(b.span("size"));
		b.containsText(b.span("size"), "0.3046875 Kb");
		b.containsText(b.span("type"), "Single");
	}
	
	public void testMultiFileUpload(){
		b.navigateTo(baseURL + "/demo/php/fileUpload.htm");
		b.file("file[]").setFile("scripts/demo/uploadme.txt");
		b.file("file[]").setFile("scripts/demo/uploadme2.txt");
		b.submit("Submit Array").click();
		assertTrue(b.span("type").text().indexOf("Array") != -1);
		assertTrue(b.span("file").text().indexOf("uploadme.txt") != -1);
		assertTrue(b.span("size").text().indexOf("0.3046875 Kb") != -1);
		
		assertTrue(b.span("file[1]").text().indexOf("uploadme2.txt") != -1);
		assertTrue(b.span("size[1]").text().indexOf("0.32421875 Kb") != -1);
	}
	
	public void testSahiDemoClicks(){
		b.navigateTo(baseURL + "/demo/formTest.htm");
		assertNotNull(b.checkbox("c1"));
	    b.checkbox("c1").click();
	    assertEquals("true", b.checkbox("c1").fetch("checked"));
	    b.checkbox("c1").click();
	    assertEquals("false", b.checkbox("c1").fetch("checked"));
	    
	    assertNotNull(b.radio("r1"));
	    b.radio("r1").click();
	    assertEquals("true", b.radio("r1").fetch("checked"));
	    assertTrue(b.radio("r1").checked());
	    assertFalse(b.radio("r1[1]").checked());
	    b.radio("r1[1]").click();
	    assertEquals("false", b.radio("r1").fetch("checked"));
	    assertTrue(b.radio("r1[1]").checked());
	    assertFalse(b.radio("r1").checked());
	}
	
	public void testLinks(){
		b.navigateTo(baseURL + "/demo/index.htm");
		b.link("Link Test").click();
		b.link("linkByContent").click();
		b.link("Back").click();
		b.link("link with return true").click();
		assertTrue(b.textarea("ta1").exists());
		assertEquals("", b.textarea("ta1").value());
		b.link("Back").click();
		b.link("Link Test").click();
		b.link("link with return false").click();
		assertTrue(b.textbox("t1").exists());
		assertEquals("formTest link with return false", b.textbox("t1").value());
		assertTrue(b.link("linkByContent").exists());

		b.link("link with returnValue=false").click();
		assertTrue(b.textbox("t1").exists());
		assertEquals("formTest link with returnValue=false", b.textbox("t1").value());
		b.link("added handler using js").click();
		assertTrue(b.textbox("t1").exists());
		assertEquals("myFn called", b.textbox("t1").value());
		b.textbox("t1").setValue("");
		b.image("imgWithLink").click();
		b.link("Link Test").click();
		b.image("imgWithLinkNoClick").click();
		assertTrue(b.textbox("t1").exists());
		assertEquals("myFn called", b.textbox("t1").value());
		b.link("Back").click();		
	}
	
	public void testPopupTitleNameMix() {
		b.navigateTo(baseURL + "/demo/index.htm");
		b.link("Window Open Test").click();
		b.link("Window Open Test With Title").click();
		b.link("Table Test").click();
		
		Browser popupPopWin = b.popup("popWin");
		
		popupPopWin.link("Link Test").click();
		b.link("Back").click();
		
		Browser popupWithTitle = b.popup("With Title");
		
		popupWithTitle.link("Form Test").click();
		b.link("Table Test").click();
		popupWithTitle.textbox("t1").setValue("d");
		b.link("Back").click();
		popupWithTitle.textbox(1).setValue("e");
		b.link("Table Test").click();
		popupWithTitle.textbox("name").setValue("f");
		assertNotNull(popupPopWin.link("linkByHtml").exists());

		assertNotNull(b.cell("CellWithId"));
		assertEquals("Cell with id", b.cell("CellWithId").text());
		popupWithTitle.link("Break Frames").click();
		
		Browser popupSahiTests = b.popup("Sahi Tests");
		popupSahiTests.close();
		
		popupPopWin.link("Break Frames").click();
//		popupPopWin.link("Close Self").click();
		popupPopWin.close();
		b.link("Back").click();
	}
	
	public void testIn() {
		b.navigateTo(baseURL + "/demo/tableTest.htm");
		assertEquals("111", b.textarea("ta").near(b.cell("a1")).getValue());
		assertEquals("222", b.textarea("ta").near(b.cell("a2")).getValue());
		b.link("Go back").in(b.cell("a1").parentNode()).click();
		assertTrue(b.link("Link Test").exists());
	}
	
	public void testExists(){
		b.navigateTo(baseURL + "/demo/index.htm");
		assertTrue(b.link("Link Test").exists());
		assertFalse(b.link("Link Test NonExistent").exists());		
	}
	
	public void testWaitFor() {
		b.navigateTo(baseURL + "/demo/waitCondition1.htm");
		BrowserCondition condition = new BrowserCondition(b){@Override
		public boolean test() {
			return "populated".equals(b.textbox("t1").value());
		}};
		b.waitFor(condition, 5000);
		assertEquals("populated", b.textbox("t1").value());
	}
	
	public void alert1(String message) {
		b.navigateTo(baseURL + "/demo/alertTest.htm");
		b.textbox("t1").setValue("Message " + message);
		b.button("Click For Alert").click();
		b.navigateTo("/demo/alertTest.htm");
		b.waitFor(1000);
		assertEquals("Message " + message, b.lastAlert());
		b.clearLastAlert();
		assertNull(b.lastAlert());
	}
	
	public void testAlert(){
		alert1("One");
		alert1("Two");
		alert1("Three");
		b.button("Click For Multiline Alert").click();
		assertEquals("You must correct the following Errors:\nYou must select a messaging price plan.\nYou must select an international messaging price plan.\nYou must enter a value for the Network Lookup Charge", b.lastAlert());
	}	
	public void testLastAlert(){
		b.navigateTo(baseURL + "/demo/alertTest.htm");
		b.textbox("t1").setValue("Message Alert1");
		b.button("Click For Alert").click();
		b.textbox("t1").setValue("Message Alert2");
		b.button("Click For Alert").click();
		String []Alerts = b.lastAlert(true);
		String []ExpectedAlert = new String[]{"Message Alert1","Message Alert2"};
		assertEquals(Arrays.toString(ExpectedAlert), Arrays.toString(Alerts));
		Alerts = b.lastAlert(false);
		ExpectedAlert = new String[]{"Message Alert2"};
		assertEquals(Arrays.toString(ExpectedAlert), Arrays.toString(Alerts));
		b.waitFor(1000);
		b.clearLastAlert();
		ExpectedAlert = new String[0];
		Alerts = b.lastAlert(true);
		assertEquals(Arrays.toString(ExpectedAlert), Arrays.toString(Alerts));
		Alerts = b.lastAlert(false);
		assertEquals(Arrays.toString(ExpectedAlert), Arrays.toString(Alerts));
	}
	public void xtestGoogle(){
		b.open();
		b.navigateTo("http://www.google.com");
		b.setValue(b.textbox("q"), "sahi forums");
		b.submit("Google Search").click();
		b.waitFor(1000);
		b.link("Forums - Sahi - Web Automation and Test Tool").click();		
		b.link("Login").click();
		assertTrue(b.textbox("req_username").exists());
	}
	
	public void xtestGoogleDD() throws Exception {
		b.open();
		b.navigateTo("http://www.google.com");
		b.setValue(b.textbox("q"), "sahi dow");
		b.waitFor(3000);
		assertTrue(b.cell("sahi download").isVisible());
		b.textbox("q").keyDown(40, 0);
		b.textbox("q").keyUp(40, 0);
		assertEquals("sahi download", b.textbox("q").getValue());
	}
	
	public void xtestForumsExists() throws Exception {
		b.navigateTo("http://sahi.co.in/forums/");		
		b.link("Login").click();
		assertTrue(b.textbox("req_username").exists());		
	}
	
	public void testConfirm(){
		b.navigateTo(baseURL + "/demo/confirmTest.htm");
		b.expectConfirm("Some question?", true);
		b.button("Click For Confirm").click();
		assertEquals("oked", b.textbox("t1").value());
		b.navigateTo("/demo/confirmTest.htm");
		b.waitFor(1000);
		assertEquals("Some question?", b.lastConfirm());
		b.clearLastConfirm();
		assertNull(b.lastConfirm());

		b.expectConfirm("Some question?", false);
		b.button("Click For Confirm").click();
		assertEquals("canceled", b.textbox("t1").value());
		assertEquals("Some question?", b.lastConfirm());
		b.clearLastConfirm();
		assertNull(b.lastConfirm());

		b.expectConfirm("Some question?", true);
		b.button("Click For Confirm").click();
		assertEquals("oked", b.textbox("t1").value());
		assertEquals("Some question?", b.lastConfirm());				
		b.clearLastConfirm();
		assertNull(b.lastConfirm());
	}
	
	public void testLastConfirm(){
		b.navigateTo(baseURL + "/demo/confirmTest.htm");
		b.clearLastConfirm();
		b.expectConfirm("Some question?", true);
		b.button("Click For Confirm").click();
		assertEquals("oked", b.textbox("t1").value());
		String confirmArray[]=b.lastConfirm(true);
		assertEquals(1,b.lastConfirm(true).length);
		for(int i=0;i<1;i++){
			assertEquals("Some question?",confirmArray[i]);
		}
		b.navigateTo("/demo/confirmTest.htm");
		b.waitFor(1000);
		b.expectConfirm("Some question?", false);
		b.button("Click For Confirm").click();
		assertEquals("canceled", b.textbox("t1").value());
		assertEquals("Some question?", b.lastConfirm());
		assertEquals(2,b.lastConfirm(true).length);
		confirmArray = b.lastConfirm(true);
		for(int i=0;i<2;i++){
			assertEquals("Some question?",confirmArray[i]);
		}
	}
	
	public void testPrompt(){
		b.navigateTo(baseURL + "/demo/promptTest.htm");
		b.expectPrompt("Some prompt?", "abc");
		b.button("Click For Prompt").click();
		assertNotNull(b.textbox("t1"));
		assertEquals("abc", b.textbox("t1").value());
		b.navigateTo("/demo/promptTest.htm");
		b.waitFor(2000);
		assertEquals("Some prompt?", b.lastPrompt());
		b.clearLastPrompt();
		assertNull(b.lastPrompt());		
	}
	
	public void testLastPrompt(){
		b.navigateTo(baseURL + "/demo/promptTest.htm");
		b.clearLastPrompt();
		String [] expectedPrompts = new String[0];
		String [] prompts = b.lastPrompt(true);
		assertEquals(Arrays.toString(expectedPrompts), Arrays.toString(prompts));
		b.expectPrompt("Some prompt?", "abc");
		b.button("Click For Prompt").click();
		assertEquals("abc", b.textbox("t1").value());
		b.navigateTo("/demo/promptTest.htm");
		b.waitFor(2000);
		expectedPrompts = new String[]{"Some prompt?"};
		prompts = b.lastPrompt(true);
		assertEquals(Arrays.toString(expectedPrompts), Arrays.toString(prompts));
		b.expectPrompt("Some prompt?", "abc");
		b.button("Click For Prompt").click();
		expectedPrompts = new String[]{"Some prompt?","Some prompt?"};
		prompts = b.lastPrompt(true);
		assertEquals(Arrays.toString(expectedPrompts), Arrays.toString(prompts));
		b.clearLastPrompt();
		expectedPrompts = new String[0];
		prompts = b.lastPrompt(true);
		assertEquals(Arrays.toString(expectedPrompts), Arrays.toString(prompts));
	}

	@SuppressWarnings("deprecation")
	public void testIsVisible(){
		b.navigateTo(baseURL + "/demo/index.htm");
		b.link("Visible Test").click();
		assertTrue(b.spandiv("using display").isVisible());

		b.button("Display none").click();
		assertFalse(b.isVisible(b.spandiv("using display")));
		b.button("Display block").click();
		assertTrue(b.isVisible(b.spandiv("using display")));

		b.button("Display none").click();
		assertFalse(b.isVisible(b.spandiv("using display")));
		b.button("Display inline").click();
		assertTrue(b.isVisible(b.spandiv("using display")));

		assertTrue(b.isVisible(b.spandiv("using visibility")));
		b.button("Visibility hidden").click();
		assertFalse(b.isVisible(b.spandiv("using visibility")));
		b.button("Visibility visible").click();
		assertTrue(b.isVisible(b.spandiv("using visibility")));

		assertFalse(b.isVisible(b.byId("nestedBlockInNone")));
		assertFalse(b.isVisible(b.byId("absoluteNestedBlockInNone")));

		
	}
	
	public void testCheck() throws Exception {
		b.navigateTo(baseURL + "/demo/");
		b.link("Form Test").click();
		assertEquals("false", b.checkbox("c1").fetch("checked"));
		assertFalse(b.checkbox("c1").checked());
		b.checkbox("c1").check();
		assertEquals("true", b.checkbox("c1").fetch("checked"));
		assertTrue(b.checkbox("c1").checked());
		b.checkbox("c1").check();
		assertEquals("true", b.checkbox("c1").fetch("checked"));
		b.checkbox("c1").uncheck();
		assertEquals("false", b.checkbox("c1").fetch("checked"));
		b.checkbox("c1").uncheck();
		assertEquals("false", b.checkbox("c1").fetch("checked"));
		b.checkbox("c1").click();
		assertEquals("true", b.checkbox("c1").fetch("checked"));
	}
	
	public void testFocus() throws Exception {
		b.navigateTo(baseURL + "/demo/focusTest.htm");
		b.textbox("t2").focus();
		assertEquals("focused", b.textbox("t1").value());
		b.textbox("t2").removeFocus();
		assertEquals("not focused", b.textbox("t1").value());
		b.textbox("t2").focus();
		assertEquals("focused", b.textbox("t1").value());		
	}
	
	public void testTitle() throws Exception {
		b.navigateTo(baseURL + "/demo/index.htm");
		assertEquals("Sahi Tests", b.title());
		b.link("Form Test").click();
		assertEquals("Form Test", b.title());
		b.link("Back").click();
		b.link("Window Open Test With Title").click();
		assertEquals("With Title", b.popup("With Title").title());
	}
	
	public void testArea() throws Exception {
		b.navigateTo(baseURL + "/demo/map.htm");
		b.navigateTo("map.htm");
		assertTrue(b.area("Record").exists());
		assertTrue(b.area("Playback").exists());
		assertTrue(b.area("Info").exists());
		assertTrue(b.area("Circular").exists());
		b.area("Record").mouseOver();
		assertEquals("Record", b.div("output").getText());
		b.mouseOver(b.button("Clear"));
		assertEquals("", b.div("output").getText());
		b.click(b.area("Record"));
		assertTrue(b.link("linkByContent").exists());
		//b.navigateTo("map.htm");		
	}
	
	public void testRegExp() throws Exception {
		b.navigateTo(baseURL + "/demo/regexp.htm");
		assertEquals("Inner", b.div("Inner").getText());
		assertEquals("Inner", b.div("/Inner/[1]").getText());
		assertTrue(!b.div("/Inner/[3]").exists());
		
		assertTrue(b.link("/Vi/[0]").fetch("href").indexOf("0.htm")!=-1);
		assertTrue(b.link("View[1]").fetch("href").indexOf("1.htm")!=-1);
		assertTrue(b.link("/Vi/[2]").fetch("href").indexOf("2.htm")!=-1);
		assertTrue(b.link("View[3]").fetch("href").indexOf("3.htm")!=-1);		
	}
	
	public void testContainsText() throws Exception {
		b.navigateTo(baseURL + "/demo/containTest.htm");
		assertTrue(b.div("a").containsText("find me here"));
		assertTrue(b.div("a").containsText("me"));
		assertTrue(b.div("a").containsText("/find/"));
		assertTrue(b.div("a").containsText("/f.*nd/"));
		assertTrue(b.accessor("document.body").containsHTML("<DIV") || b.accessor("document.body").containsHTML("<div"));
		assertTrue(b.accessor("document.body").containsHTML("/find .* here/"));		
	}
	
	public void testStyle() throws Exception {
		b.navigateTo(baseURL + "/demo/mouseover.htm");
		if (b.isChrome() || b.isFirefox()){
			assertEquals("16px", b.span("Hi Kamlesh").style("font-size"));
			assertEquals("rgb(0, 0, 238)", b.span("Hi Kamlesh").style("color"));
		} else {
			assertEquals("12pt", b.span("Hi Kamlesh").style("font-size"));
			assertEquals("#0066cc", b.span("Hi Kamlesh").style("color"));
		}
		
	}
	
	public void testDoubleClick() throws Exception {
	    b.navigateTo(baseURL + "/demo/clicks.htm");
	    b.div("dbl click me").highlight();
	    b.div("dbl click me").doubleClick();
	    assertEquals("[DOUBLE_CLICK]", b.textarea("t2").value());
	    b.button("Clear").click();
	}
	
	
	public void testRightClick() throws Exception {
	    b.navigateTo(baseURL + "/demo/clicks.htm");
	    b.div("right click me").rightClick();
	    assertEquals("[RIGHT_CLICK]", b.textarea("t2").value());
	    b.button("Clear").click();
	}
	
	public void testUnder() throws Exception {
		b.navigateTo(baseURL + "/demo/tableTest.htm");
		assertEquals("x1-2", b.cell(0).near(b.cell("x1-0")).under(b.tableHeader("header 3")).getText());
		assertEquals("x1-3", b.cell(0).near(b.cell("x1-0")).under(b.tableHeader("header 4")).getText());
	}
	
	
	public void xtestSaveAs() throws Exception {
		b.navigateTo(baseURL + "/demo/");
		String absolutePath = "testsaveas_x.zip";
		File file = new File(absolutePath);
		if (file.exists()) file.delete();
		assertTrue(!file.exists());
		
		b.link("Save As Test").click();
		b.link("testsaveas.zip").click();
		assertEquals("testsaveas.zip", b.lastDownloadedFileName());
		String filePath = "testsaveas_x.zip";
		b.saveDownloadedAs(filePath);
		assertTrue(file.exists());	
		if (file.exists()) file.delete();
		b.clearLastDownloadedFileName();
		assertNull(b.lastDownloadedFileName());
		
	}
	
	public void testBrowserJS() throws Exception {
		b.setBrowserJS("function giveMyNumber(){return '23';}");
		b.navigateTo(baseURL + "/demo/");
		assertEquals("23", b.fetch("giveMyNumber()"));
		b.link("Link Test").click();
		assertEquals("23", b.fetch("giveMyNumber()"));
		b.link("Back").click();
	}
	
	public void testFillMe() throws Exception {
		b.navigateTo(baseURL + "/demo/");
		b.link("Link Test").click();
		b.link("Back").click();
		b.link("Window Open Test").click();
		b.popup("popWin").link("Alert Test").click();
		assertTrue(b.popup("popWin").link("Alert Test").exists());
		b.popup("popWin").link("Break Frames").click();
	}
	
	public void xtestDomain() {
		// works only on FF right now.
		b.navigateTo(baseURL + "/demo/");
		b.link("Different Domains External").click();
		b.domain("www.tytosoftware.com").link("Link Test").click();
		b.domain("www.bing.com").textbox("q").setValue("fdsfsd");
		b.domain("www.tytosoftware.com").link("Back").click();
		b.domain("www.bing.com").div("bgDiv").click();	
		b.navigateTo(baseURL + "/demo/");
	}
	
	public void xtestLateRooms() throws Exception {
		b.navigateTo("http://www.laterooms.com/");
		b.textbox("k").setValue("Manchester");
		b.submit("do").click();
		b.link("Premier Apartments Manchester").click();
		assertTrue(b.heading1("/Premier Apartments Manchester/").exists());
	}
	
	public void testFileUploadWithChangedType() throws Exception {
		b.navigateTo(baseURL + "/demo/php/fileUpload.htm");
		b.file("file").setFile("scripts/demo/uploadme.txt");
		if ("true".equals(b.fetch("_sahi._isIE()"))) { 
			b.execute("_sahi._file('file').outerHTML = _sahi._file('file').outerHTML.replace(/type=file/, 'type=text')");
		} else {
			b.execute("_sahi._file('file').type = 'text'");
		}
		b.textbox("file").setValue("scripts/demo/uploadme.txt");
		b.submit("Submit Single").click();
		assertTrue(b.span("size").exists());
		assertTrue(b.span("size").text().indexOf("0.3046875 Kb") != -1);
		assertTrue(b.span("type").text().indexOf("Single") != -1);
		b.link("Back to form").click();
	}
	
	public void testTextareaHandlesNewlines() throws Exception {
		b.navigateTo(baseURL + "/demo/");
		b.link("Form Test").click();
		b.textarea("ta1").setValue("a\nb");
		assertEquals("a\nb", b.textarea("ta1").getValue().replace("\r\n", "\n"));
	}
	
	public void testCount() throws Exception {
		b.navigateTo(baseURL + "/demo/count.htm");
		assertEquals(4, b.link("group 0 link").countSimilar());
		assertEquals(0, b.link("group non existent link").countSimilar());
		assertEquals(5, b.link("/group 1/").countSimilar());
		assertEquals(2, b.link("/group 1/").in(b.div("div1")).countSimilar());
	}
	
	public void testCollect() throws Exception {
		b.navigateTo(baseURL + "/demo/count.htm");
		
		List<String> attr = b.collect(b.link("/group 1/").in(b.div("div1")), "sahiText");
		assertEquals(attr.get(0), "group 1 link3");
		assertEquals(attr.get(1), "group 1 link4");
		
		List<ElementStub> elements = b.collect(b.link("/group 1/").in(b.div("div1")));
        assertEquals(2, elements.size());
        assertEquals("group 1 link3", elements.get(0).getText());
		assertEquals("group 1 link4", elements.get(1).getText());
		
		List<ElementStub> els = b.link("/group 1/").collectSimilar();
		assertEquals(5, els.size());
		assertEquals("group 1 link1", els.get(0).getText());
		assertEquals("group 1 link2", els.get(1).getText());

		b.navigateTo(baseURL + "/demo/count.htm");
		List<ElementStub> els2 = b.link("/group 1/").in(b.div("div1")).collectSimilar();
		assertEquals(2, els2.size());
		assertEquals("group 1 link3", els2.get(0).getText());
		assertEquals("group 1 link4", els2.get(1).getText());
		
		b.navigateTo(baseURL + "/demo/count.htm");
		List<ElementStub> els3 = b.link("/.*/").in(b.div("div1")).collectSimilar();
		assertEquals(2, els3.size());
		assertEquals("group 1 link3", els3.get(0).getText());
		assertEquals("group 1 link4", els3.get(1).getText());
		
	}
	
	public void testHTML5FormFields() throws Exception {
		b.navigateTo(baseURL + "/demo/html5_form_fields.htm");
		b.datebox("dob").setValue("2010-10-10");
		assertEquals("2010-10-10", b.datebox("dob").getValue());
		b.execute("_sahi._rangebox(\"points\").value = 3");
		assertEquals("3", b.rangebox("points").getValue());
		b.rangebox("points").setValue("5");
		assertEquals("5", b.rangebox("points").getValue());
		b.weekbox("week2").setValue("2009-W10");
		assertEquals("2009-W10", b.weekbox("week2").getValue());
	}
	
	public void testWikipedia() throws Exception {
		b.navigateTo("http://www.wikipedia.org");
		b.searchbox("search").setValue("sahi software");
		b.submit("go").click();
	}
	
	public void testExecuteSahi() throws Exception {
		b.navigateTo(baseURL + "/demo/");
		b.executeSahi("_click(_link(\"Link Test\"))");
		assertTrue(b.heading2("Link Test").exists());
	}
	
	public void testStrictVisibility() throws Exception {
		b.navigateTo(baseURL + "/demo/strict_visible.htm");
		assertTrue(b.textbox("q").exists());
		assertTrue(b.textbox("q[1]").exists());
		assertFalse(b.textbox("q[1]").isVisible());
		assertTrue(b.textbox("q[2]").exists());
		
		b.setStrictVisibilityCheck(true);
		assertTrue(b.textbox("q").exists());
		assertTrue(b.textbox("q[1]").exists());
		assertFalse(b.textbox("q[2]").exists());
		
		b.setStrictVisibilityCheck(false);
		assertTrue(b.textbox("q").exists());
		assertTrue(b.textbox("q[1]").exists());
		assertFalse(b.textbox("q[1]").isVisible());
		assertTrue(b.textbox("q[2]").exists());
	}
	
	public void xtestFlex() throws Exception {
		b.navigateTo("http://sahi.co.in/demo/flex/sample.html");
		b.flex("yuiswf0").find("textinput", "username2").setValue("abcd");
		System.out.println(b.flex("yuiswf0").find("textinput", "username2").introspect());
		System.out.println(b.flex("yuiswf0").find("textinput", "username2").listProperties());
		assertEquals("abcd", b.flex("yuiswf0").find("textinput", "username2").getValue());
	}
	
	public void xtestFlexMethods() throws Exception {
		b.navigateTo("http://sahi.co.in/demo/flex/sample.html");
		b.flex("yuiswf0").find("textinput", "username2").setValue("abcd");
		System.out.println(b.flex("yuiswf0").find("textinput", "username2").introspect());
		System.out.println(b.flex("yuiswf0").find("textinput", "username2").listProperties());
		assertEquals("abcd", b.flex("yuiswf0").find("textinput", "username2").getValue());
		b.flex("yuiswf0").find("textinput", "username2").set("text", "xyz");
		assertEquals("xyz", b.flex("yuiswf0").find("textinput", "username2").getValue());
		assertEquals("xyz", b.flex("yuiswf0").find("textinput", "username2").get("text"));
		b.flex("yuiswf0").find("textinput", "username2").set("text", "xyz");
		b.flex("yuiswf0").find("textinput", "username2").executeFunction("move", 12, 40);
		assertEquals("12", b.flex("yuiswf0").find("textinput", "username2").get("x"));
		assertEquals("40", b.flex("yuiswf0").find("textinput", "username2").get("y"));
	}
	
	public void xtestCuteEditor() throws Exception {
		b.navigateTo("http://cutesoft.net/asp/EnableAll.asp");
		b.rte("CE_Editor1_ID_Frame").rteWrite("<html><b>Hhahaia</b></html>");
	}
	
	public void testCompareImages() throws Exception {
		b.navigateTo(baseURL + "/demo/training");
		b.setValue(b.textbox("user"), "test");
		File f1 = new File("userdata\\scripts\\demo\\snapshot_login_short.png");
		File f2 = new File("userdata\\scripts\\demo\\snapshot_totaled.png");
		String file1 = f1.getAbsolutePath();
		String file2 = f2.getAbsolutePath();
		boolean same = b.compareImages(file1, file1, 10);
		assertTrue(same);
		boolean same2 = b.compareImages(file1, file2, 10);
		assertFalse(same2);
	}
	
	public void testActiveElement() throws Exception {
		b.navigateTo(baseURL + "/demo/training/login.htm");
		b.textbox("user").focus();
		assertEquals("user", b.activeElement().fetch("name"));
		b.password("password").focus();
		assertEquals("password", b.activeElement().fetch("name"));
	}
	public void testMouseDownMouseUp() throws Exception {
		b.navigateTo(baseURL + "/demo/mouseEvents.htm");
		b.button("Capture mouse down").mouseDown();
		assertEquals("[MOUSE_DOWN]",b.getText(b.textarea("t2")));
		b.button("Capture mouse up").mouseUp();
		assertEquals("[MOUSE_DOWN][MOUSE_UP]",b.getText(b.textarea("t2")));
	}
	
	public void testKeyPressAndGetAttribute(){
		b.navigateTo(baseURL + "/demo/keypress.htm");
		b.click(b.radio("r3"));
		b.keyPress(b.textbox("t2"), "a", "CTRL");
		assertEquals("key pressed charCode=[97] keyCode=[0] CTRL",b.getText(b.textbox("t1")));
		b.keyPress(b.textbox("t2"), "c", "ALT");
		assertEquals("key pressed charCode=[99] keyCode=[0] ALT", b.getText(b.textbox("t1")));
		assertEquals((b.getAttribute(b.textbox("t1"),"size")),"70");
		b.keyPress(b.textbox("t2"), "c");
		assertEquals("key pressed charCode=[99] keyCode=[0] NONE", b.getText(b.textbox("t1")));
	}
	
	public void testBlur(){
		b.navigateTo(baseURL + "/demo/focusTest.htm");
		b.focus(b.textbox("t2"));
		assertEquals("focused", b.textbox("t1").getValue());
		b.removeFocus(b.textbox("t2"));
		assertEquals("not focused", b.textbox("t1").getValue());
		b.focus(b.textbox("t2"));
		assertEquals("focused", b.textbox("t1").getValue());
		b.blur(b.textbox("t2"));
		assertEquals("not focused", b.textbox("t1").getValue());
		
	}
	
	public void testTakeSnapshotAndFocusWindow() throws InterruptedException{
		b.navigateTo(baseURL + "/demo/training");
		b.setValue(b.textbox("user"), "test");
		File file = new File("D:\\abcd.jpg");
		if (file.exists()) file.delete();
		assertFalse(file.exists());	
		b.focusWindow();
		b.takeSnapShot("D:\\abcd.jpg");	
		assertTrue(file.exists());
		b.setValue(b.password("password"), "secret");
		if (file.exists()) file.delete();
	}
	public void testTakeScreenshotAndFocusWindow() throws InterruptedException{
		b.navigateTo(baseURL + "/demo/training");
		b.setValue(b.textbox("user"), "test");
		File file = new File("D:\\abcd.jpg");
		if (file.exists()) file.delete();
		assertFalse(file.exists());	
		b.focusWindow();
		b.takeScreenShot("D:\\abcd.jpg");
		Thread.sleep(1000);
		assertTrue(file.exists());
		b.setValue(b.password("password"), "secret");
		if (file.exists()) file.delete();
		assertFalse(file.exists());	
		b.focusWindow();
		File file2 = new File("D:\\abcd.gif");
		if (file2.exists()) file2.delete();
		b.takeScreenShot("D:\\abcd.gif", "gif", 50);
		Thread.sleep(1000);
		assertTrue(file2.exists());
		if (file2.exists()) file2.delete();
	}
	public void testTakePageScreenshotAndFocusWindow() throws InterruptedException{
		b.navigateTo(baseURL + "/demo/training");
		b.setValue(b.textbox("user"), "test");
		File file = new File("D:\\abcd.jpg");
		if (file.exists()) file.delete();
		assertFalse(file.exists());	
		b.focusWindow();
		Properties props = new Properties();
		props.put("delay", 200);
		props.put("scrollLimit", 2000);
		props.put("trim", true);
		props.put("format", "jpg");
		props.put("resizePercentage", 50);
		b.takePageScreenShot("D:\\abcd.jpg", b.div("/Sahi Training Site/"), props);
		assertTrue(file.exists());
		
		if (file.exists()) file.delete();
		assertFalse(file.exists());	
		b.focusWindow();
		b.takePageScreenShot("D:\\abcd.jpg", b.div("/Sahi Training Site/"));
		assertTrue(file.exists());
		
		if (file.exists()) file.delete();
		assertFalse(file.exists());	
		b.focusWindow();
		b.takePageScreenShot("D:\\abcd.jpg");
		assertTrue(file.exists());
	}
	public void testFocusWindow() throws InterruptedException{
		b.navigateTo("http://sahi.co.in/demo/training");
		b.setValue(b.textbox("user"), "test");
		b.focusWindow();
		b.takeSnapShot("D://abcd.gif");	
		b.setValue(b.password("password"), "secret");

	}
	
	public void testPrintCalledAndClearPrintCalled(){
		b.navigateTo(baseURL + "/demo/print.htm");
		assertFalse(b.printCalled());
		b.click(b.button("Print"));
		assertTrue(b.printCalled());
		b.clearPrintCalled();
		assertFalse(b.printCalled());
		b.click(b.button("Print"));
		assertTrue(b.printCalled());

	}
	
	public void testCreateAndDeleteCookie(){
		b.createCookie("abc", "zyx", 5);
		System.out.println(b.cookie());
	}
	
	public void testSetXSRStates(){
		b.navigateTo(baseURL + "/demo/");
		assertEquals("true",b.fetch("_sahi.waitWhenXHRReadyState1"));
		assertEquals("true",b.fetch("_sahi.waitWhenXHRReadyState2"));
		assertEquals("true",b.fetch("_sahi.waitWhenXHRReadyState3"));
		
		b.setXHRReadyStatesToWaitFor("2,3");
		assertEquals("false",b.fetch("_sahi.waitWhenXHRReadyState1"));
		assertEquals("true",b.fetch("_sahi.waitWhenXHRReadyState2"));
		assertEquals("true",b.fetch("_sahi.waitWhenXHRReadyState3"));

		b.click(b.link("Link Test"));
		assertEquals("false",b.fetch("_sahi.waitWhenXHRReadyState1"));
		assertEquals("true",b.fetch("_sahi.waitWhenXHRReadyState2"));
		assertEquals("true",b.fetch("_sahi.waitWhenXHRReadyState3"));


		b.setXHRReadyStatesToWaitFor("2");
		b.click(b.link("Back"));
		assertEquals("false",b.fetch("_sahi.waitWhenXHRReadyState1"));
		assertEquals("true",b.fetch("_sahi.waitWhenXHRReadyState2"));
		assertEquals("false",b.fetch("_sahi.waitWhenXHRReadyState3"));

	}
	
	public void testHTTPHeader(){
		b.navigateTo(baseURL + "/demo/php/userAgent.php");
		assertNotSame("ABCD", b.getText(b.paragraph("useragent")));
		b.setHttpHeader("User-Agent","ABCD" );
		b.navigateTo(baseURL + "/demo/php/userAgent.php",true);
		assertEquals("ABCD",b.getText(b.paragraph("useragent")));
		b.resetHttpHeader("User-Agent");
		b.navigateTo(baseURL + "/demo/php/userAgent.php",true);
		assertFalse("ABCD".equals(b.getText(b.paragraph("useragent"))));
//		b.removeHttpHeader("User-Agent");
//		b.navigateTo(baseURL + "/demo/php/userAgent.php",true);
//		assertEquals("dd",b.getText(b.paragraph("useragent")));
	}
	
	public void saveOnPopup(){
		b.link("Save As Test").click();
		b.link("testsaveas.pdf").click();
		b.link("Back").click();
		assertTrue(b.link("Link Test").exists());
		b.popup("/File Downloaded/").link("Close Window").click();
	}
	
	public void saveOnBaseWindow(){
		b.link("Save As Test").click();
		b.link("testsaveas.zip").click();
		b.link("Back").click();
		assertTrue(b.link("Link Test").exists());
	}
	
	public void testDownloadInPopup(){
		b.navigateTo(baseURL + "/demo/");	
		b.sendHTMLResponseAfterFileDownload(true);
		saveOnPopup();
		b.sendHTMLResponseAfterFileDownload(false);
		saveOnBaseWindow();
		b.sendHTMLResponseAfterFileDownload(true);
		saveOnPopup();
	}
	
	public void testSetFileWithThirdArguement(){
		b.navigateTo(baseURL + "/demo/php/fileUpload.htm");	
		b.setFile(b.file("file4"), "scripts/demo/uploadme.txt", "fileUpload.php");
		b.click(b.submit("Submit Single"));
		assertTrue(b.span("size").exists());
		assertTrue(b.span("size").getText().contains("0.3046875 Kb"));
		assertTrue(b.span("type").getText().contains("Single"));
		
	}
	
	public void xtestKeyUpAndKeyDown(){
		b.navigateTo(baseURL + "/demo/keypress.htm");
		b.check(b.radio("r2"));
//		b.keyDown(b.textbox("t2"), "a", "CTRL");
//		assertEquals("key downed charCode=[0] keyCode=[90] CTRL",b.getText(b.textbox("t1")));
		b.keyDown(b.textbox("t2"), "a");
		b.waitFor(10000);
		assertEquals("key downed charCode=[0] keyCode=[65] NONE",b.getText(b.textbox("t1")));
		
	}
	
	public void testResizeWindow(){
		b.navigateTo(baseURL + "/demo/window_actions.html");
		b.windowAction("focus");
		b.windowAction("maximize");
		int width = Integer.parseInt(b.fetch("window.innerWidth"));
		int height = Integer.parseInt(b.fetch("window.innerHeight"));
		b.resizeWindow(800, 500);
		int widthNew = Integer.parseInt(b.fetch("window.innerWidth"));
		int heightNew = Integer.parseInt(b.fetch("window.innerHeight"));
		assertTrue(widthNew < width);
		assertTrue(heightNew < height);
	}
	
	public void testWindowActions(){
		b.navigateTo(baseURL + "/demo/window_actions.html");
		b.windowAction("focus");
		assertEquals("focused", b.textbox("focus").getValue());
		b.windowAction("maximize");
		assertEquals("maximized", b.textbox("maximize").getValue());
		b.windowAction("minimize");
		b.windowAction("restore");
		assertEquals("maximized", b.textbox("maximize").getValue());
		assertEquals("original", b.textbox("refresh").getValue());
		b.button("Change").click();
		assertEquals("changed", b.textbox("refresh").getValue());
		b.windowAction("refresh");
		assertEquals("original", b.textbox("refresh").getValue());
		
	}
	
	public void testRightOfCases(){
		b.navigateTo(baseURL + "/demo/left_right_offsets.html");
		assertEquals(b.cell(3).getText(), b.cell(0).rightOf(b.cell(6), 30, 10).getText());
		assertEquals(b.cell(12).getText(), b.cell(0).rightOf(b.cell(6), 0, 50).getText());
		assertEquals(b.cell("4......4").getText(), b.cell(0).rightOf(b.cell("2......3"), 0, 50).getText());
		assertEquals(b.cell("4......5").getText(), b.cell(1).rightOf(b.cell("2......3"), 0, 50).getText());
		assertEquals(b.bold("4.link").getText(), b.bold(3).rightOf(b.bold("2.link"), 40, 50).getText());
		assertEquals(b.link("1.link").getText(), b.link(0).rightOf(b.cell("5......5"), 0, 70).getText());
	}
	
	public void testLeftOfCases(){
		b.navigateTo(baseURL + "/demo/left_right_offsets.html");
		assertEquals(b.bold("2.link").getText(), b.bold(1).leftOf(b.bold("3.link"), 0, 50).getText());
		assertEquals(b.bold("2.link").getText(), b.bold(1).leftOf(b.bold("3.link"), 40, 50).getText());
		assertEquals(b.cell("1......1").getText(), b.cell(0).leftOf(b.cell("4......2"), 100, 0).getText());
		assertEquals(b.bold("3.link").getText(), b.bold(2).leftOf(b.bold("4.link"), 100, 0).getText());
		assertEquals(b.bold("2.link").getText(), b.bold(1).leftOf(b.bold("3.link"), 0, 100).getText());
		assertEquals(b.cell(4).getText(), b.cell(0).leftOf(b.cell(16), 100, 0).getText());
	}
	
	public void testLeftOrRightOfCases(){
		b.navigateTo(baseURL + "/demo/left_right_offsets.html");
		assertEquals(b.bold("2.link").getText(), b.bold(1).leftOrRightOf(b.bold("3.link"), 0, 100).getText());
		assertEquals(b.cell("1......4").getText(), b.cell(3).leftOrRightOf(b.cell("4......2"), 100, 0).getText());
		assertEquals(b.cell("1......4").getText(), b.cell(3).leftOrRightOf(b.cell("3......2"), 60, 0).getText());
		assertEquals(b.cell("1......1").getText(), b.cell(0).leftOrRightOf(b.cell("4......2"), 100, 0).getText());
		assertEquals(b.bold("3.link").getText(), b.bold(2).leftOrRightOf(b.bold("4.link"), 100, 0).getText());
		assertEquals(b.bold("2.link").getText(), b.bold(1).leftOrRightOf(b.bold("3.link"), 0, 100).getText());
		assertEquals(b.cell(4).getText(), b.cell(0).leftOrRightOf(b.cell(16), 100, 0).getText());
	}
	
	public void xtestTouch() throws Exception {
		b.navigateTo("http://localhost.sahi.co.in/demo/touchTest.htm");
		assertEquals("", b.getText(b.textarea("t1")));
		b.touch(b.button("b1"));
		assertEquals("touchstart\ntouchmove\ntouchend\n", b.getText(b.textarea("t1")));
		
	}
	public void xtestTouchMove() throws Exception {
		b.navigateTo("http://localhost/demo/touchMoveTest.htm");
		b.touchMove(b.div("Drag me![1]"), 1000, 100);
		assertEquals(1100,b.getElementPositionLeft(b.div("Drag me![1]")));
		assertEquals(200,b.getElementPositionTop(b.div("Drag me![1]")));

		b.navigateTo("http://localhost/demo/touchMoveTest.htm",true);
		b.touchMove(b.div("Drag me![1]"), 1000, 500);
		b.touchMove(b.div("Drag me![1]"), -500, -250);
		assertEquals(600,b.getElementPositionLeft(b.div("Drag me![1]")));
		assertEquals(350,b.getElementPositionTop(b.div("Drag me![1]")));

		b.navigateTo("http://localhost/demo/touchMoveTest.htm",true);
		b.touchMove(b.div("Drag me![1]"),50,50,true);
		assertEquals(150,b.getElementPositionLeft(b.div("Drag me![1]")));
		assertEquals(150,b.getElementPositionTop(b.div("Drag me![1]")));

		b.touchMove(b.div("Drag me![1]"),50,50,true);
		assertEquals(200,b.getElementPositionLeft(b.div("Drag me![1]")));
		assertEquals(200,b.getElementPositionTop(b.div("Drag me![1]")));
		
		b.touchMove(b.div("Drag me![1]"),50,50,false);
		assertEquals(50,b.getElementPositionLeft(b.div("Drag me![1]")));
		assertEquals(50,b.getElementPositionTop(b.div("Drag me![1]")));

	}
	
	@Override
	public void setBrowser() {
		setBrowser("firefox");
	}		
}
