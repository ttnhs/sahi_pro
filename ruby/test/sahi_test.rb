require 'test/unit'
require '../lib/sahi.rb'

class SahiDriverTest < Test::Unit::TestCase
  def setup
	@b = init_browser()
	@browser = @b
    @b.open
    @base_url = "http://localhost.sahi.co.in"
  end
  
  def teardown
    if @b
      @b.set_speed = 100
      @b.close
      sleep(1)
    end
  end  
  
  def init_browser()
    # Look at sahi/userdata/config/browser_types.xml to configure browsers.
    @browser_name = "chrome"
    return Sahi::Browser.new(@browser_name)
  end

  def test1
    @b.navigate_to(@base_url + "/demo/formTest.htm")
    @b.textbox("t1").value = "aaa"            
    @b.link("Back").click
    @b.link("Table Test").click        
    assert_equal("Cell with id", @b.cell("CellWithId").text)
  end
  
  def test_file_upload_native_events
  	@b.navigate_to("http://sahi.co.in/demo/")
	@b.link("File Upload Test").click
	@b.wait(5) {@b.file("file").visible?}
	@b.window_action("focus")
	# focus on the element
	@b.file("file").focus()
	@b.wait(5)
	@b.type_key_code_native(32)
	@b.wait(7)
	# type the file path
	@b.type_native("D:\\abc.txt")
	@b.wait(1)
	# press enter
	@b.type_key_code_native(10)
	@b.wait(5)
	@b.submit("Submit Single").click
	@b.wait(1)
	assert(@b.span("abc.txt").exists?)
	assert(@b.span("abc.txt").visible?)
  end
  
  def test_prompt()
    @b.navigate_to(@base_url  + "/demo/promptTest.htm")
    @b.expect_prompt("Some prompt?", "abc")
    @b.button("Click For Prompt").click;
    assert_not_nil(@b.textbox("t1"))
    assert_equal("abc", @b.textbox("t1").value)
    @b.navigate_to("/demo/promptTest.htm")
    @b.wait(2)
    assert_equal("Some prompt?", @b.last_prompt())
    @b.clear_last_prompt()
    assert_nil(@b.last_prompt())        
  end
  
  def test_last_prompt()
  	@b.navigate_to(@base_url  + "/demo/promptTest.htm")
  	@b.clear_last_prompt()
  	prompts = @b.last_prompt(true)
  	expected = []
  	assert_equal(expected,prompts)
  	@b.expect_prompt("Some prompt?", "abc")
    @b.button("Click For Prompt").click;
    @b.navigate_to(@base_url  + "/demo/promptTest.htm")
    @b.expect_prompt("Some prompt?", "abc")
    @b.button("Click For Prompt").click;
    prompts = @b.last_prompt(true)
    expected = ["Some prompt?","Some prompt?"]
    assert_equal(expected,prompts)
    @b.clear_last_prompt()
  	prompts = @b.last_prompt(true)
  	expected = []
  	assert_equal(expected,prompts)
  end
  
  def xtest_ZK
    @b.speed = 200
    @b.navigate_to("http://www.zkoss.org/zkdemo/userguide/")
    @b.div("Hello World").click
    @b.span("Pure Java").click
    @b.div("Various Form").click
    @b.wait(5000) {@b.textbox("z-intbox[1]").visible?}
    
    @b.div("Comboboxes").click
    @b.textbox("z-combobox-inp").value = "aa"
    @b.italic("z-combobox-btn").click
    @b.cell("Simple and Rich").click

    @b.italic("z-combobox-btn[1]").click
    @b.span("The coolest technology").click
    @b.italic("z-combobox-btn[2]").click
    @b.image("CogwheelEye-32x32.gif").click
    assert(@b.textbox("z-combobox-inp[2]").exists?)    
  end
  

  def test_fetch() 
    @b.navigate_to(@base_url + "/demo/formTest.htm")
    assert_equal(@base_url + "/demo/formTest.htm", @b.fetch("window.location.href"))
  end
  
  
# def test_select_text_range()
#	@b.navigate_to("http://developer.yahoo.com/yui/examples/editor/icon_editor_clean.html")
#	@b.rte(1).select_text_range("his is some more[1]", "before")
#	@b.link("Insert Image").click
#	@b.navigate_to("http://developer.yahoo.com/yui/examples/editor/icon_editor_clean.html",true)
#	@b.rte(1).select_text_range("This is some more[3]", "before")
#	@b.link("Insert Image").click
#	@b.navigate_to("http://developer.yahoo.com/yui/examples/editor/icon_editor_clean.html",true)
#	@b.rte(1).select_text_range("This is some more[3]")
#	@b.link("Insert Image").click
# end
  
  def test_accessors()
    @b.navigate_to(@base_url  + "/demo/formTest.htm")
    assert_equal("", @b.textbox("t1").value)
    assert(@b.textbox(1).exists?)
    assert(@b.textbox("$a_dollar").exists?)
    @b.textbox("$a_dollar").value = ("adas")
    assert_equal("", @b.textbox(1).value)
    assert(@b.textarea("ta1").exists?)
    assert_equal("", @b.textarea("ta1").value)
    assert(@b.textarea(1).exists?)
    assert_equal("", @b.textarea(1).value)
    assert(@b.checkbox("c1").exists?)
    assert_equal("cv1", @b.checkbox("c1").value)
    assert(@b.checkbox(1).exists?)
    assert_equal("cv2", @b.checkbox(1).value)
    assert(@b.checkbox("c1[1]").exists?)
    assert_equal("cv3", @b.checkbox("c1[1]").value)
    assert(@b.checkbox(3).exists?)
    assert_equal("", @b.checkbox(3).value)
    assert(@b.radio("r1").exists?)
    assert_equal("rv1", @b.radio("r1").value)
    assert(@b.password("p1").exists?)
    assert_equal("", @b.password("p1").value)
    assert(@b.password(1).exists?)
    assert_equal("", @b.password(1).value)
    assert(@b.select("s1").exists?)
    assert_equal("o1", @b.select("s1").selected_text())
    assert(@b.select("s1Id[1]").exists?)
    assert_equal("o1", @b.select("s1Id[1]").selected_text())
    assert(@b.select(2).exists?)
    assert_equal("o1", @b.select(2).selected_text())
    assert(@b.button("button value").exists?)
    assert(@b.button("btnName[1]").exists?)
    assert(@b.button("btnId[2]").exists?)
    assert(@b.button(3).exists?)
    assert(@b.submit("Add").exists?)
    assert(@b.submit("submitBtnName[1]").exists?)
    assert(@b.submit("submitBtnId[2]").exists?)
    assert(@b.submit(3).exists?)
    assert(@b.image("imageAlt1").exists?)
    assert(@b.image("imageId1[1]").exists?)
    assert(@b.image(2).exists?)
    assert(!@b.link("Back22").exists?)
    assert(@b.link("Back").exists?)
    assert(@b.accessor("document.getElementById('s1Id')").exists?)
  end
  
  def test_select()
    @b.navigate_to(@base_url  + "/demo/formTest.htm")
    assert_equal("o1", @b.select("s1Id[1]").selected_text())
    @b.select("s1Id[1]").choose("o2")
    assert_equal("o2", @b.select("s1Id[1]").selected_text())
    @b.select(3).choose(["o1", "o3"])
    assert_equal("o1,o3", @b.select(3).selected_text())
  end
    
  def test_set_file()
    @b.navigate_to(@base_url  + "/demo/php/fileUpload.htm")
    @b.file("file").file = "scripts/demo/uploadme.txt";
    @b.submit("Submit Single").click;
    assert(@b.span("size").exists?)
    assert_not_nil(@b.span("size").text().index("0.3046875 Kb"))
    assert_not_nil(@b.span("type").text().index("Single"))
    @b.link("Back to form").click;
  end
  
  def test_multi_file_upload()
    @b.navigate_to(@base_url  + "/demo/php/fileUpload.htm")
    @b.file("file[]").file = "scripts/demo/uploadme.txt";
    @b.file("file[]").file = "scripts/demo/uploadme2.txt";
    @b.submit("Submit Array").click;
    assert_not_nil(@b.span("type").text().index("Array"))
    assert_not_nil(@b.span("file").text().index("uploadme.txt"))
    assert_not_nil(@b.span("size").text().index("0.3046875 Kb"))
    
    assert_not_nil(@b.span("file[1]").text().index("uploadme2.txt"))
    assert_not_nil(@b.span("size[1]").text().index("0.32421875 Kb"))
  end
  
  def test_screen_size()
  	@b.navigate_to(@base_url  + "/demo/")
  	@b.window_action('resize',800,400)
  	size = @b.screen_size();
  	assert((size[0]>=783)&&(size[0]<=800))
  	assert((size[1]>=280)&&(size[1]<=400))
  	
  end
  
  def test_user_agent()
  	@b.navigate_to(@base_url  + "/demo/")
  	assert_equal(@b.user_agent(),@b.fetch("_sahi._userAgent()"))
  end
  
  def test_clicks()
    @b.navigate_to(@base_url  + "/demo/formTest.htm")
    assert_not_nil(@b.checkbox("c1"))
    @b.checkbox("c1").click;
    assert_equal("true", @b.checkbox("c1").fetch("checked"))
    @b.checkbox("c1").click;
    assert_equal("false", @b.checkbox("c1").fetch("checked"))
    
    assert_not_nil(@b.radio("r1"))
    @b.radio("r1").click;
    assert_equal("true", @b.radio("r1").fetch("checked"))
    assert(@b.radio("r1").checked?)
    assert(!@b.radio("r1[1]").checked?)
    @b.radio("r1[1]").click;
    assert_equal("false", @b.radio("r1").fetch("checked"))
    assert(@b.radio("r1[1]").checked?)
    assert(!@b.radio("r1").checked?)
  end
  
  def test_table_contents()
	@b.navigate_to("http://sahi.co.in/demo/tableTest.htm")
	
	list=@b.table("t2").table_contents()
	assert_equal("Item", list[0][0])
	assert_equal("Price", list[0][1])
	assert_equal("Number", list[0][2])
	assert_equal("Tooth brush", list[1][0])
	assert_equal("Rs. 20", list[1][1])
	assert_equal("3", list[1][2])
	assert_equal("Soap", list[2][0])
	assert_equal("Rs. 18", list[2][1])
	assert_equal("4", list[2][2])
	
	columns = [0,"/.*_ID.*/","/.*_NU.*/"]
	list=@b.table("t4").table_contents(columns,1,5);
	assert_equal("E101", list[0][0])
	assert_equal("Dev12", list[0][1])
	assert_equal("987123", list[0][2])
	assert_equal("E102", list[1][0])
	assert_equal("Dev14", list[1][1])
	assert_equal("425323", list[1][2])
	assert_equal("E103", list[2][0])
	assert_equal("Dev18", list[2][1])
	assert_equal("654124", list[2][2])
	assert_equal("E201", list[3][0])
	assert_equal("Dev14", list[3][1])
	assert_equal("562452", list[3][2])
	
	columns=[0,1]
	list=@b.table("t4").table_contents(columns,"/.*E10.*/",10)
	assert_equal("E101", list[0][0])
	assert_equal("Steven", list[0][1])
	assert_equal("E102", list[1][0])
	assert_equal("Neena", list[1][1])
	assert_equal("E103", list[2][0])
	assert_equal("Allan", list[2][1])
	assert_equal("E101", list[3][0])
	assert_equal("Bob", list[3][1])
	
	columns=[1,2,"EMAIL"]
	list=@b.table("t4").table_contents(columns,5,10)
	assert_equal("Avdesh", list[0][0])
	assert_equal("Baghel", list[0][1])
	assert_equal("avdesh.baghel", list[0][2])
	assert_equal("Harish", list[1][0])
	assert_equal("Kumar", list[1][1])
	assert_equal("harish.kumar@gmail.com", list[1][2])
	assert_equal("Bob", list[2][0])
	assert_equal("Wattson", list[2][1])
	assert_equal("bob.wattson@gmail.com", list[2][2])
  end
  
  def test_links()
    @b.navigate_to(@base_url  + "/demo/index.htm")
    @b.link("Link Test").click;
    @b.link("linkByContent").click;
    @b.link("Back").click;
    @b.link("link with return true").click;
    assert(@b.textarea("ta1").exists?)
    assert_equal("", @b.textarea("ta1").value)
    @b.link("Back").click;
    @b.link("Link Test").click;
    @b.link("link with return false").click;
    assert(@b.textbox("t1").exists?)
    assert_equal("formTest link with return false", @b.textbox("t1").value)
    assert(@b.link("linkByContent").exists?)

    @b.link("link with returnValue=false").click;
    assert(@b.textbox("t1").exists?)
    assert_equal("formTest link with returnValue=false", @b.textbox("t1").value)
    @b.link("added handler using js").click;
    assert(@b.textbox("t1").exists?)
    assert_equal("myFn called", @b.textbox("t1").value)
    @b.textbox("t1").value = ("")
    @b.image("imgWithLink").click;
    @b.link("Link Test").click;
    @b.image("imgWithLinkNoClick").click;
    assert(@b.textbox("t1").exists?)
    assert_equal("myFn called", @b.textbox("t1").value)
    @b.link("Back").click;        
  end
  
  
  def test_popup_title_name_mix() 
    @b.navigate_to(@base_url  + "/demo/index.htm")
    @b.link("Window Open Test").click;
    @b.link("Window Open Test With Title").click;
    @b.link("Table Test").click;
    
    popup_popwin = @b.popup("popWin")
    
    popup_popwin.link("Link Test").click;
    @b.link("Back").click;
    
    popup_with_title = @b.popup("With Title")
    
    popup_with_title.link("Form Test").click;
    @b.link("Table Test").click;
    popup_with_title.textbox("t1").value = ("d")
    @b.link("Back").click;
    popup_with_title.textbox(1).value = ("e")
    @b.link("Table Test").click;
    popup_with_title.textbox("name").value = ("f")
    assert_not_nil(popup_popwin.link("linkByHtml").exists?)

    assert_not_nil(@b.cell("CellWithId"))
    assert_equal("Cell with id", @b.cell("CellWithId").text)
    popup_with_title.link("Break Frames").click;
    
    popupSahiTests = @b.popup("Sahi Tests")
    popupSahiTests.close()
    
    popup_popwin.link("Break Frames").click;
    popup_popwin.close()
    @b.link("Back").click;
  end

  
  def test_in() 
    @b.navigate_to(@base_url  + "/demo/tableTest.htm")
    assert_equal("111", @b.textarea("ta").near(@b.cell("a1")).value)
    assert_equal("222", @b.textarea("ta").near(@b.cell("a2")).value)
	assert_equal("3", @b.table(0).fetch("rows.length"))
    @b.link("Go back").in(@b.cell("a1").parent_node()).click;
    assert(@b.link("Link Test").exists?)
  end
  
  def test_under() 
    @b.navigate_to(@base_url  + "/demo/tableTest.htm")
    assert_equal("x1-2", @b.cell(0).near(@b.cell("x1-0")).under(@b.tableHeader("header 3")).text())
    assert_equal("x1-3", @b.cell(0).near(@b.cell("x1-0")).under(@b.tableHeader("header 4")).text())
  end
    
  def test_exists()
    @b.navigate_to(@base_url  + "/demo/index.htm")
    assert(@b.link("Link Test").exists?)
    assert(!@b.link("Link Test NonExistent").exists?)        
  end
  
  def test_range()
  	@b.navigate_to(@base_url  + "/demo/")
  	@b.link("Form Test").click
  	@b.textarea("ta1").value = "abcdefgh";
  	@b.textarea("ta1").select_range(2,4)
  	assert_equal("cd", @b.selection_text())
  	@b.navigate_to(@base_url + "/demo/", true)
	@b.link("IFrames Test").click
	@b.link("Form Test").click
	@b.textarea("ta1").value = "abcdefgh"
	@b.textarea("ta1").select_range(2, 4)
	assert_equal("cd", @b.selection_text())
  end	
  
  def alert1(message) 
    @b.navigate_to(@base_url  + "/demo/alertTest.htm")
    @b.textbox("t1").value = ("Message " + message)
    @b.button("Click For Alert").click
    @b.navigate_to("/demo/alertTest.htm")
    sleep(1)
    assert_equal("Message " + message, @b.last_alert())
    @b.clear_last_alert()
    assert_nil(@b.last_alert())
  end  
  
  def test_alert()
    alert1("One")
    alert1("Two")
    alert1("Three")
    @b.button("Click For Multiline Alert").click
    assert_equal("You must correct the following Errors:\nYou must select a messaging price plan.\nYou must select an international messaging price plan.\nYou must enter a value for the Network Lookup Charge", @b.last_alert())
  end
  
  def test_last_alert()
 	@b.navigate_to(@base_url  + "/demo/alertTest.htm")
  	@b.clear_last_alert()
  	alerts = @b.last_alert(true)
    expected = []
   	assert_equal(expected,alerts)
    @b.textbox("t1").value = ("Message One")
    @b.button("Click For Alert").click;
    @b.navigate_to("/demo/alertTest.htm")
    alerts = @b.last_alert(true)
    expected = ["Message One"]
   	assert_equal(expected,alerts)
    sleep(1)
    @b.navigate_to(@base_url  + "/demo/alertTest.htm")
    @b.textbox("t1").value = ("Message Two")
    @b.button("Click For Alert").click
    alerts = @b.last_alert(true)
    expected = ["Message One","Message Two"]
   	assert_equal(expected,alerts)
  end
  
  def test_last_confirm()
  	@b.navigate_to(@base_url  + "/demo/confirmTest.htm")
  	@b.clear_last_confirm()
  	confirms = @b.last_confirm(true)
  	expected = []
  	assert_equal(expected,confirms)
 
  	@b.expect_confirm("Some question?", true)
    @b.button("Click For Confirm").click;
    assert_equal("oked", @b.textbox("t1").value)
    confirms = @b.last_confirm(true)
  	expected = ["Some question?"]
  	assert_equal(expected,confirms)
  	
  	@b.expect_confirm("Some question?", false)
    @b.button("Click For Confirm").click;
    assert_equal("canceled", @b.textbox("t1").value)
    confirms = @b.last_confirm(true)
  	expected = ["Some question?","Some question?"]
  	assert_equal(expected,confirms)
  	
  	@b.clear_last_confirm()
  	confirms = @b.last_confirm(true)
  	expected = []
  	assert_equal(expected,confirms)
  end
  
  def test_confirm()
    @b.navigate_to(@base_url  + "/demo/confirmTest.htm")
    @b.expect_confirm("Some question?", true)
    @b.button("Click For Confirm").click;
    assert_equal("oked", @b.textbox("t1").value)
    @b.navigate_to("/demo/confirmTest.htm")
    sleep(1)
    assert_equal("Some question?", @b.last_confirm())
    @b.clear_last_confirm()
    assert_nil(@b.last_confirm())

    @b.expect_confirm("Some question?", false)
    @b.button("Click For Confirm").click;
    assert_equal("canceled", @b.textbox("t1").value)
    assert_equal("Some question?", @b.last_confirm())
    @b.clear_last_confirm()
    assert_nil(@b.last_confirm())

    @b.expect_confirm("Some question?", true)
    @b.button("Click For Confirm").click;
    assert_equal("oked", @b.textbox("t1").value)
    assert_equal("Some question?", @b.last_confirm())                
    @b.clear_last_confirm()
    assert_nil(@b.last_confirm())
  end

  def test_visible
    @b.navigate_to(@base_url  + "/demo/index.htm")
    @b.link("Visible Test").click;
    assert(@b.spandiv("using display").visible?)

    @b.button("Display none").click;
    assert(!@b.spandiv("using display").visible?)
    @b.button("Display block").click;
    assert(@b.spandiv("using display").visible?)

    @b.button("Display none").click;
    assert(!@b.spandiv("using display").visible?)
    @b.button("Display inline").click;
    assert(@b.spandiv("using display").visible?)

    assert(@b.spandiv("using visibility").visible?)
    @b.button("Visibility hidden").click;
    assert(!@b.spandiv("using visibility").visible?)
    @b.button("Visibility visible").click;
    assert(@b.spandiv("using visibility").visible?)

    assert(!@b.byId("nestedBlockInNone").visible?)
    assert(!@b.byId("absoluteNestedBlockInNone").visible?)        
  end
  
  def test_check() 
    @b.navigate_to(@base_url  + "/demo/")
    @b.link("Form Test").click;
    assert_equal("false", @b.checkbox("c1").fetch("checked"))
    assert(!@b.checkbox("c1").checked?)
    @b.checkbox("c1").check()
    assert_equal("true", @b.checkbox("c1").fetch("checked"))
    assert(@b.checkbox("c1").checked?)
    @b.checkbox("c1").check()
    assert_equal("true", @b.checkbox("c1").fetch("checked"))
    @b.checkbox("c1").uncheck()
    assert_equal("false", @b.checkbox("c1").fetch("checked"))
    @b.checkbox("c1").uncheck()
    assert_equal("false", @b.checkbox("c1").fetch("checked"))
    @b.checkbox("c1").click;
    assert_equal("true", @b.checkbox("c1").fetch("checked"))
  end
  
  def test_focus() 
    @b.navigate_to(@base_url  + "/demo/focusTest.htm")
    @b.textbox("t2").focus()
    assert_equal("focused", @b.textbox("t1").value)
    @b.textbox("t2").remove_focus()
    assert_equal("not focused", @b.textbox("t1").value)
    @b.textbox("t2").focus()
    assert_equal("focused", @b.textbox("t1").value)        
  end
  
  def test_title() 
    @b.navigate_to(@base_url  + "/demo/index.htm")
    assert_equal("Sahi Tests", @b.title)
    @b.link("Form Test").click;
    assert_equal("Form Test", @b.title)
    @b.link("Back").click;
    @b.link("Window Open Test With Title").click;
    assert_equal("With Title", @b.popup("With Title").title)
  end
  
  def test_area() 
    @b.navigate_to(@base_url  + "/demo/map.htm")
    @b.navigate_to("map.htm")
    assert(@b.area("Record").exists?)
    assert(@b.area("Playback").exists?)
    assert(@b.area("Info").exists?)
    assert(@b.area("Circular").exists?)
    @b.area("Record").mouse_over()
    assert_equal("Record", @b.div("output").text)
    @b.button("Clear").mouse_over()
    assert_equal("", @b.div("output").text)
    @b.area("Record").click;
    assert(@b.link("linkByContent").exists?)
    #@b.navigate_to("map.htm")        
  end  
  
  def test_dragdrop()
    @b.navigate_to("http://www.snook.ca/technical/mootoolsdragdrop/")
    @b.div("Drag me").drag_and_drop_on(@b.xy(@b.div("Item 2"), 5, 5))
    assert @b.div("dropped").exists?
    assert @b.div("Item 1").exists?
    assert @b.div("Item 3").exists?
    assert @b.div("Item 4").exists?
  end 
  
  def test_wait() 
    @b.navigate_to(@base_url  + "/demo/waitCondition1.htm")
    @b.wait(15) {"populated" == @b.textbox("t1").value}
    assert_equal("populated", @b.textbox("t1").value)
  end
  
  def test_google()
    @b.navigate_to("http://www.google.com")
    @b.textbox("q").value = "sahi forums"
    @b.submit("Google Search").click
    @b.link("Sign in").click
    @b.wait(1)     
    assert @b.emailbox("Email").visible?
  end

  def test_dblclick()
    @b.navigate_to("#{@base_url}/demo/clicks.htm")
    @b.div("dbl click me").dblclick
    assert_equal("[DOUBLE_CLICK]", @b.textarea("t2").value)
    @b.button("Clear").click
  end
  
  def test_right_click()
    @b.navigate_to("#{@base_url}/demo/clicks.htm")
    @b.div("right click me").right_click
    assert_equal("[RIGHT_CLICK]", @b.textarea("t2").value)
    @b.button("Clear").click
  end
  
def test_different_domains()
   @b.navigate_to("#{@base_url}/demo/")
   @b.link("Different Domains External").click
   domain_tyto = @b.domain("sahipro.com")
   domain_bing = @b.domain("www.bing.com")
   
   domain_tyto.link("Link Test").click
   
   if (domain_bing.textbox("q").exists?)
   		domain_bing.textbox("q").value = "fdsfsd"
   elsif (domain_bing.searchbox("q").exists?)
   		domain_bing.searchbox("q").value = "fdsfsd"
   end
   
   domain_tyto.link("Back").click
   domain_bing.div("bgDiv").click

   @b.navigate_to("#{@base_url}/demo/");
 end
  
  def test_browser_types()
    @b.navigate_to("#{@base_url}/demo/")
    if (@browser_name == "firefox")
      assert(!@b.ie?())
      assert(@b.firefox?())
    elsif (@browser_name == "ie")
      assert(@b.ie?())
      assert(!@b.firefox?())
    end
  end
  
  def test_browser_js()
    @b.browser_js = "function giveMyNumber(){return '23';}"
    @b.navigate_to("#{@base_url}/demo/")
    assert_equal("23", @b.fetch("giveMyNumber()"))
    @b.link("Link Test").click()
    assert_equal("23", @b.fetch("giveMyNumber()"))
    @b.link("Back").click()
  end
  
  def test_count()
    @b.navigate_to("#{@base_url}/demo/count.htm")
    var1 = @b.link("group 0 link").count_similar()
    var2 = @b.link("group non existent link").count_similar()
    var3 = @b.link("/group 1/").count_similar()
    var4 = @b.link("/group 1/").in(@b.div("div1")).count_similar()
    @b.wait(2);
    assert_equal(4, var1)
	assert_equal(0, var2);
	assert_equal(5, var3);
	assert_equal(2, var4);    
  end
  
  def test_collect()
    @b.navigate_to("#{@base_url}/demo/count.htm")
	elsAttr = @b.collect(@b.link("/group 1/").in(@b.div("div1")), "sahiText");
	@b.wait(2);
    assert_equal(2, elsAttr.size());
	assert_equal("group 1 link3", elsAttr[0]);
	assert_equal("group 1 link4", elsAttr[1]);
	
	elsAttr2 = @b.collect(@b.link("/group 1/").in(@b.div("div1")));
	@b.wait(2);
    assert_equal(2, elsAttr.size());
	assert_equal("group 1 link3", elsAttr2[0].text);
	assert_equal("group 1 link4", elsAttr2[1].text);
	
	els = @b.link("/group 1/").collect_similar();
	@b.wait(2);
	assert_equal(5, els.size());
	assert_equal("group 1 link1", els[0].text);
	assert_equal("group 1 link2", els[1].text);

	@b.navigate_to("#{@base_url}/demo/count.htm")
	els2 = @b.link("/group 1/").in(@b.div("div1")).collect_similar();
	@b.wait(2);
	assert_equal(2, els2.size());
	assert_equal("group 1 link3", els2[0].text);
	assert_equal("group 1 link4", els2[1].text);
  end

  def test_strict_visible()
  	@b.navigate_to("#{@base_url}/demo/strict_visible.htm")
	assert_equal("b", @b.textbox("q[1]").value)
	@b.strict_visibility_check = true
	assert_equal("c", @b.textbox("q[1]").value)
	@b.strict_visibility_check = false
	assert_equal("b", @b.textbox("q[1]").value)
  end

  def test_active_element()
  	@b.navigate_to("#{@base_url}/demo/training/login.htm")
  	@b.textbox("user").focus()
  	assert_equal("user", @b.activeElement().fetch("name"))
	@b.password("password").focus()
  	assert_equal("password", @b.activeElement().fetch("name"))
  end
  
  def test_identify_by_multiple_attributes()
  	@b.navigate_to("#{@base_url}/demo/training/books.htm")
  	@b.textbox("q[2]").value = "aaa"
  	assert_equal("aaa", @b.textbox({"name"=>"q", "sahiIndex"=>2}).value)
  end
  
  def test_key_press()
  	@b.navigate_to("#{@base_url}/demo/formTest.htm")
  	@b.textbox("t1").key_press("a")
  	assert_equal("a", @b.textbox("t1").value)
  	@b.textbox("t1").key_press([66,98]);
  	assert_equal("ab", @b.textbox("t1").value)
  end
  
  def test_execute_sahi()
    @b.navigate_to(@base_url + "/demo/")
    #@b.execute_step("_sahi._click(_sahi._link('Link Test'))")
    @b.execute_sahi("_click(_link('Link Test'))") 
    assert_equal("Link Test", @b.heading2("Link Test").text)           
  end
  
  def test_take_screen_shot()
    @b.navigate_to(@base_url + "/demo/training")
    @b.textbox("user").value = "test"    
	filename = "D:/abcd.jpg"
	File.delete(filename) if File.exist?(filename)
	assert_equal(false, File.exist?(filename))
	@b.window_action("focus")
	@b.take_screen_shot(filename, "jpg", 50);
	@b.wait(2)
	assert_equal(true, File.exist?(filename))
	
	File.delete(filename) if File.exist?(filename)
	assert_equal(false, File.exist?(filename))
	@b.window_action("focus")
	@b.take_screen_shot(filename);	
	@b.wait(2)
	assert_equal(true, File.exist?(filename))
  end
  
  def test_take_page_screen_shot()
    @b.navigate_to(@base_url + "/demo/training")
    @b.textbox("user").value = "test"      
	filename = "D:/abcd.jpg"
	File.delete(filename) if File.exist?(filename)
	assert_equal(false, File.exist?(filename))
	@b.window_action("focus")
	@b.take_page_screen_shot(filename);	
	@b.wait(2)
	assert_equal(true, File.exist?(filename))
	
	File.delete(filename) if File.exist?(filename)
	assert_equal(false, File.exist?(filename))
	@b.window_action("focus")
	@b.take_page_screen_shot(filename, @b.textbox("user"));	
	@b.wait(2)
	assert_equal(true, File.exist?(filename))
	
	File.delete(filename) if File.exist?(filename)
	assert_equal(false, File.exist?(filename))
	@b.window_action("focus")
	props = {'delay' => 200, 'scrollLimit' => 2000, 'trim' => true, 'format' => 'jpg', 'resizePercentage' => 50}
	@b.take_page_screen_shot(filename, @b.textbox("user"), props);	
	@b.wait(2)
	assert_equal(true, File.exist?(filename))
  end
  
  def test_get_win_simple
  	@b.navigate_to(@base_url + "/demo/")
	@b.wait(4)
	windows = @b.get_windows()
	assert_equal(1, windows.length)
	assert_equal("0", windows[0]["wasOpened"])
	assert_equal("Sahi Tests", windows[0]["windowTitle"])
  end
  
  def test_get_win_popup_with_title
		@b.navigate_to(@base_url + "/demo/")
		@b.link("Window Open Test With Title").click
		@b.wait(4)
		windows = @b.get_windows()
		assert_equal(2, windows.length);
		assert_equal("1", windows[1]["wasOpened"]);
		assert_equal("With Title", windows[1]["windowTitle"]);
  end
  
  def test_compare_images
    f1 = File.join(Dir.pwd, "../../userdata/scripts/demo/snapshot_login_short.png")
    file1 = File.expand_path(f1)
    f2 = File.join(Dir.pwd, "../../userdata/scripts/demo/snapshot_totaled.png")
    file2 = File.expand_path(f2)
    @b.navigate_to(@base_url + "/demo/")
    same = @b.compare_images(file1, file1, 10)
    assert(same, "first compare images failed")
    same2 = @b.compare_images(file1, file2, 10)
    assert(!same2)
  end
  
  def test_get_win_popup_without_title
 		@b.navigate_to(@base_url + "/demo/")
		@b.link("Window Open Test").click
		@b.wait(3)
		windows = @b.get_windows()
		assert_equal(2, windows.length)
		assert_equal("1", windows[1]["wasOpened"])
		assert_equal("", windows[1]["windowTitle"])
  end
  
  def test_get_win_popup_with_param
 		@b.navigate_to(@base_url + "/demo/")
		@b.link("Window Open Test").click
		popup_popwin = @b.popup("popWin")
		popup_popwin.close
		@b.wait(3)
		windows = @b.get_windows()
		windows2 = @b.get_windows(0)
		windows3 = @b.get_windows(2)
		assert_equal(2, windows.length)
		assert_equal(2, windows2.length)
		assert_equal(1, windows3.length)
  end
end