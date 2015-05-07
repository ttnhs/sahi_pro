require 'net/http'
require 'time'
require 'json'

module Sahi
# The Browser class controls different browsers via Sahi's proxy.
#
# Author::    Narayan Raman (mailto:narayan@sahi.co.in)
# Copyright:: Copyright (c) 2006  V Narayan Raman
#
# Download Sahi from http://sahi.co.in/ .
# Java 1.5 or greater is needed to run Sahi.
# 
# Start Sahi:
# cd sahi\userdata\bin;
# start_sahi.bat;
# 
# or 
# 
# cd sahi/userdata/bin;
# start_sahi.sh;
# 

  class Browser 
    attr_accessor :proxy_host, :proxy_port, :print_steps, :sahisid, :popup_name, :domain_name
    
    # Takes browser_type as specified in sahi/userdata/config/browser_types.xml (name of browserType) - RECOMMENDED
    #
    # OR
    #
    # Takes browser_path, browser_options and browser_executable - NOT RECOMMENDED
    # Various browser options needed to initialize the Browser object are:
    # 
    # Internet Explorer 6&7:
    # 	browser_path = "C:\\Program Files\\Internet Explorer\\iexplore.exe"
    # 	browser_options = ""
    #   browser_executable = "iexplore.exe"
    # 
    # Internet Explorer 8:
    # 	browser_path = "C:\\Program Files\\Internet Explorer\\iexplore.exe"
    # 	browser_options = "-nomerge"
    #   browser_executable = "iexplore.exe"
    # 
    # Firefox:
    #   browser_path = "C:\\Program Files\\Mozilla Firefox\\firefox.exe"
    #   browser_options = "-profile $userDir/browser/ff/profiles/sahi0 -no-remote"
    #   browser_executable = "firefox.exe"
    # 
    # Chrome:
    # 	userdata_dir = "D:/sahi/sf/sahi_993/userdata" #  path to Sahi's userdata directory.
    #   browser_path = "C:\\Documents and Settings\\YOU_THE_USER\\Local Settings\\Application Data\\Google\\Chrome\\Application\\chrome.exe"
    #   browser_options = "--user-data-dir=# {userdata_dir}\browser\chrome\profiles\sahi$threadNo"
    #   browser_executable = "chrome.exe"
    # 
    # Safari:
    # 	browser_path = "C:\\Program Files\\Safari\Safari.exe"
    # 	browser_options = ""
    #   browser_executable = "safari.exe"
    # 	
    # Opera:
    # 	browser_path = "C:\\Program Files\\Opera\\opera.exe"
    # 	browser_options = ""	
    #   browser_executable = "opera.exe"
    
    def initialize(*args)
      @proxy_host = "localhost"
      @proxy_port = 9999
      if args.size == 3
        @browser_path = args[0]
        @browser_options = ars[1]
        @browser_executable = args[2]
      elsif args.size == 1
        @browser_type = args[0]
      end
      @popup_name = nil
      @domain_name = nil
      @sahisid = nil
      @print_steps = false
    end
    
    def check_proxy()
      begin
        response("http://#{@proxy_host}:#{@proxy_port}/_s_/spr/blank.htm")
      rescue
        raise "Sahi proxy is not available. Please start the Sahi proxy."
      end
    end
    
    #opens the browser
    def open()
      check_proxy()
      @sahisid = Time.now.to_f
      start_url = "http://sahi.example.com/_s_/dyn/Driver_initialized"
      if (@browser_type != null)
        exec_command("launchPreconfiguredBrowser", {"browserType" => @browser_type, "startUrl" => start_url})
      else
        exec_command("launchAndPlayback", {"browser" => @browser, "browserOptions" => @browser_options, "browserExecutable" => @browser_executable, "startUrl" => start_url})
      end
      
      i = 0
      while (i < 500)
        i+=1
        break if is_ready?
        sleep(0.1)
      end
    end 
    
    def is_ready?
      return  "true".eql?(exec_command("isReady"))
    end
    
    def exec_command(cmd, qs={})
      res = response("http://#{@proxy_host}:#{@proxy_port}/_s_/dyn/Driver_" + cmd, {"sahisid"=>@sahisid}.update(qs))
      return res.force_encoding("UTF-8")
    end
    
    def response(url, qs={})
      return Net::HTTP.post_form(URI.parse(url), qs).body
    end
        
    # navigates to the given url
    def navigate_to(url, force_reload=false)
      execute_step("_sahi._navigateTo(\"" + url + "\", "+ (force_reload.to_s()) +")");
    end
    
    def execute_step(step)
      if popup?() 
        step = "_sahi._popup(#{Utils.quoted(@popup_name)})." + step
      end
      if domain?() 
        step = "_sahi._domain(#{Utils.quoted(@domain_name)})." + step
      end
      #puts step
      exec_command("setStep", {"step" => step})
      i = 0
      while (i < 500)
        sleep(0.1)
        i+=1
        check_done = exec_command("doneStep")
        done = "true".eql?(check_done)
        
        error = check_done.index("error:") == 0
        return if done
		if (error)
          raise check_done
		end        
      end      
    end
    
    def prepare_window_action(oldTitle)
		len = oldTitle.length
		if (len > 30) 
			len = 30
		end
		titleToUse = fetch("_sahi.trim(#{Utils.quoted(oldTitle[0..30].strip)})")
		newTitle = titleToUse.gsub(/[^0-9a-zA-Z ]/, '') + ' _' + Time.now.getutc.to_s
		execute_step("window.document.title =" + Utils.quoted(newTitle))
		wait(2);
		return newTitle
  	end
    
	# Takes screenshot
	def take_screen_shot(filepath,format="-1",resizePercentage=-1)
		isPhantomJS = exec_command("isPhantomJS");
		if(isPhantomJS == "true")
			execute_step("_sahi._takePageScreenShot(null, " + Utils.quoted(filepath) + ", true, {'format':" + Utils.quoted(format) + ", 'resizePercentage':" + resizePercentage.to_s + "})")
		else
			exec_command("takeScreenShot", {"filepath" => filepath, "format" => format,"resizePercentage" => resizePercentage })
		end
	end
	
	# Takes a browser page or browser element screen shot with properties
	def take_page_screen_shot(filepath,el="null",props=nil)
		if(props == nil)
			execute_step("_sahi._takePageScreenShot(" + el.to_s + ", " + Utils.quoted(filepath) + ", true)")
		else
			props.default = "false"
			if(!props["format"])
				props["format"] = "-1"
			end
			if(!props["resizePercentage"])
				props["resizePercentage"] = "-1"
			end
			execute_step("_sahi._takePageScreenShot(" + el.to_s + ", " + Utils.quoted(filepath) + ", true, {'format':" + Utils.quoted(props["format"]) + ", 'resizePercentage':" + props["resizePercentage"].to_s + ", 'delay':" + props["delay"].to_s + ", 'scrollLimit':" + props["scrollLimit"].to_s + ", 'trim':" + props["trim"].to_s + "})")
		end
	end
	
  # Takes the path of the 2 images and check both images are same or not.
  # returns true, if both of the images are same.
  # returns false, if both of the images are not same.
	# This api is dependent on GraphicsMagick software.
  def compare_images(file1,file2,threshold)
    match = exec_command("compareImages", {"image1" => file1, "image2" => file2,"threshold" => threshold.to_s })
    if("true" == match) 
      return true
    else
      return false
    end 
  end
	
	# Performs various window level actions. Current works only on Windows Operating Systems.
  # On Mac and Linux does nothing.
  def window_action(action,width=nil,height=nil)
		title = fetch("window.top.document.title")
		title = prepare_window_action(title)
		puts ">" + title + "<"
		if((width !=nil) && (height!=nil))
			exec_command("windowAction", {"action" => action, "title" => title,"width" => width,"height" =>height })
		else
			exec_command("windowAction", {"action" => action, "title" => title})
		end
	end
	
	def type_key_code_native(key)
		exec_command("typeKeyCodeNative", {"key" => key})
	end
	
	# returns an array of window-property objects.
	# a window-property is just an associative array with the following attributes:
	# windowName, windowTitle, windowURL, wasOpened, domain, initialTime, lastTime
	def get_windows(activePeriod=nil)
		if(activePeriod == nil)
    		str = exec_command("getWindowsAsJSON", {"activePeriod" => -1});
     	else
     		activePeriod = activePeriod * 1000
			str = exec_command("getWindowsAsJSON", {"activePeriod" => activePeriod});
     	end
		return JSON.parse(str)
	end
	
	# types text using native events
	def type_native(str)
		exec_command("typeNative", {"str" => str})
	end
    
    def execute_sahi(step)
      if popup?() 
        step = "_sahi._popup(#{Utils.quoted(@popup_name)})." + step
      end
      if domain?() 
        step = "_sahi._domain(#{Utils.quoted(@domain_name)})." + step
      end
      #puts step
      exec_command("setStep", {"step" => step, 'addSahi' => true})
      i = 0
      while (i < 500)
        sleep(0.1)
        i+=1
        check_done = exec_command("doneStep")
        done = "true".eql?(check_done)
        
        error = check_done.index("error:") == 0
        return if done
		if (error)
          raise check_done
		end        
      end      
    end
    
    def method_missing(m, *args, &block)  
      return ElementStub.new(self, m.to_s, args)
    end 
    
    # evaluates a javascript expression on the browser and fetches its value
	def fetch(expression) 
      key = "___lastValue___" + Time.now.getutc.to_s;
      execute_step("_sahi.setServerVarForFetchPlain('"+key+"', " + expression + ")")
      return check_nil(exec_command("getVariable", {"key" => key}))
	end
    
    # evaluates a javascript expression on the browser and returns true if value is true or "true"
    def fetch_boolean(expression)
      return fetch(expression) == "true"
    end

	# returns element attributes of all elements of type attr matching the identifier within relations
    def collect(els, attr=nil)
	  if(attr == nil)
    	return els.collect_similar()
      else
		return fetch("_sahi.collectAttributesJava(#{Utils.quoted(attr)}, #{Utils.quoted(els.to_type())}, #{els.to_identifiers()})").split("___sahi___")
      end
    end
    
    
    def browser_js=(js)
      exec_command("setBrowserJS", {"browserJS"=>js})
    end

    def check_nil(s)
      return (s == "null")  ? nil : s
    end    
  
    # closes the browser
    def close()
      if popup?()
        execute_step("_sahi._closeWindow()");
      else
        exec_command("kill");
        #Process.kill(9, @pid) if @pid
      end
    end    
    
    # sets the speed of execution. The speed is specified in milli seconds
    def speed=(ms)
      exec_command("setSpeed", {"speed"=>ms})
    end
    
    # sets strict visibility check. If true, Sahi APIs ignores elements which are not visible
    def strict_visibility_check=(check)
      execute_step("_sahi._setStrictVisibilityCheck(#{check})")
    end


    # represents a popup window. The name is either the window name or its title.
    def popup(name)
      if (@browser_type != null)
        win = Browser.new(@browser_type)
      else
        win = Browser.new(@browser_path, @browser_options, @browser_executable)
      end

      win.proxy_host = @proxy_host
      win.proxy_port = @proxy_port
      win.sahisid = @sahisid
      win.print_steps = @print_steps
      win.popup_name = name
      win.domain_name = @domain_name
      return win
    end
    
    # represents a domain section of window.
    def domain(name)
      if (@browser_type != null)
        win = Browser.new(@browser_type)
      else
        win = Browser.new(@browser_path, @browser_options, @browser_executable)
      end

      win.proxy_host = @proxy_host
      win.proxy_port = @proxy_port
      win.sahisid = @sahisid
      win.print_steps = @print_steps
      win.popup_name = @popup_name
      win.domain_name = name
      return win
    end
    
    def popup?()
      return @popup_name != nil
    end 
    
    def domain?()
      return @domain_name != nil
    end     
    
    # returns the message last alerted on the browser 
    # return arry of all alert messages if passed true
    def last_alert(allalerts = false)
      alerts = []
      if(allalerts == true)
      	arr_string = fetch("_sahi.lastAlertJava()")
      	if(arr_string == "")
      	  return alerts
      	else 
          alerts = arr_string.split("__SAHIDELIMITER__")
      	  return alerts
      	end
      else
      	return fetch("_sahi._lastAlert(false)")
      end
    end
    
    # resets the last alerted message
    def clear_last_alert()
      execute_step("_sahi._clearLastAlert()")
    end
    
    # returns the last confirm message
    # return array of all confirm messages if passed true
    def last_confirm(allconfirms = false)
      confirms = []
      if(allconfirms == true)
      	arr_string = fetch("_sahi.lastConfirmJava()")
      	if(arr_string == "")
      	  return confirms
      	else
      	  confirms = arr_string.split("__SAHIDELIMITER__")
      	  return confirms
      	end
      else
      	return fetch("_sahi._lastConfirm(false)")
      end
    end
    
    # resets the last confirm message
    def clear_last_confirm()
      execute_step("_sahi._clearLastConfirm()")
    end          
    
    # set an expectation to press OK (true) or Cancel (false) for specific confirm message
    def expect_confirm(message, input)
      execute_step("_sahi._expectConfirm(#{Utils.quoted(message) }, #{input})")
    end          
     
    # returns the last prompted message
    # return array of all prompt messages if passed true
    def last_prompt(allprompts = false)
      prompts = []
      if(allprompts == true)
      	arr_string = fetch("_sahi.lastPromptJava()")
      	if(arr_string == "")
      	  return prompts
      	else
      	  prompts = arr_string.split("__SAHIDELIMITER__")
      	  return prompts
      	end
      else
      	return fetch("_sahi._lastPrompt(false)")
      end
    end
    
    # clears the last prompted message
    def clear_last_prompt()
      execute_step("_sahi._clearLastPrompt()")
    end          
    
    # simulates the touch event
    def touch()
      execute_step("_sahi._touch(#{self.to_s()})")
    end
    
    # simulates the tap event
    def tap()
      execute_step("_sahi._tap(#{self.to_s()})")
    end

	# simulates the touchStart event
    def touchStart()
      execute_step("_sahi._touchStart(#{self.to_s()})")
    end
    
    # simulates the touchEnd event
    def touchEnd()
      execute_step("_sahi._touchEnd(#{self.to_s()})")
    end
    
    # simulates the touchCancel event
    def touchCancel()
      execute_step("_sahi._touchCancel(#{self.to_s()})")
    end
    
    # simulates the touchMove event
    def touchMove(moveX, moveY, isRelative=true)
      execute_step("_sahi._touchMove(#{self.to_s()}, moveX, moveY, isRelative)")
    end
    
    # simulates the swipe event
    def swipe(moveX, moveY, isRelative=true)
      execute_step("_sahi._touchMove(#{self.to_s()}, moveX, moveY, isRelative)")
    end
    
    # set an expectation to set given value for specific prompt message
    def expect_prompt(message, input)
      execute_step("_sahi._expectPrompt(#{Utils.quoted(message)}, #{Utils.quoted(input) })")
    end          
      
    # get last downloaded file's name
    def last_downloaded_filename()
      return fetch("_sahi._lastDownloadedFileName()")
    end
    
    # clear last downloaded file's name
    def clear_last_downloaded_filename()
      execute_step("_sahi._clearLastDownloadedFileName()")
    end          
    
    # Save the last downloaded file to specified path
    def save_downloaded(file_path)
      execute_step("_sahi._saveDownloadedAs(#{Utils.quoted(file_path)})")
    end          
    
    # make specific url patterns return dummy responses. Look at _addMock documentation.
    def add_url_mock(url_pattern, clazz=nil) 
      clazz = "MockResponder_simple" if !clazz
      execute_step("_sahi._addMock(#{Utils.quoted(url_pattern)}, #{Utils.quoted(clazz)})")
    end
    
    # reverse effect of add_url_mock
	def remove_url_mock(url_pattern) 
      execute_step("_sahi._removeMock(#{Utils.quoted(url_pattern)})")
	end

    # return window title
    def title()
      return fetch("_sahi._title()")
    end    
    
    # return selection text 
	
	def selection_text(win = nil)
	  if(win != nil)
	    return fetch("_sahi._getSelectionText(#{win.to_s()})")
	  else
	    return fetch("_sahi._getSelectionText()")
	  end	
	end        
    # return array of integer where first index is inner width and second index is inner height of the browser window. 
    def screen_size()
      arraystring = fetch("_sahi._getScreenSize().join(\"_column_\")")
      array1d=[]
      screensize = []
      array1d = arraystring.split("_column_")
      array1d.each do |i|
     		screensize.push i.to_i
      end
     	return screensize
    end
      
 	# return browser Information as a String
    def user_agent() 
      return fetch("_sahi._userAgent()")
    end
        
    # returns true if browser is Internet Explorer
    def ie?()
      return fetch_boolean("_sahi._isIE()")
    end

    # returns true if browser is Firefox
    def firefox?()
      return fetch_boolean("_sahi._isFF()")
    end

    # returns true if browser is Google Chrome
    def chrome?()
      return fetch_boolean("_sahi._isChrome()")
    end

    # returns true if browser is Safari
    def safari?()
      return fetch_boolean("_sahi._isSafari()")
    end

    # returns true if browser is Opera
    def opera?()
      return fetch_boolean("_sahi._isOpera()")
    end

    # waits for specified time (in seconds). 
    # if a block is passed, it will wait till the block evaluates to true or till the specified timeout, which ever is earlier.
    def wait(timeout) 
      total = 0;
      interval = 0.2;
      
      if !block_given?
        sleep(timeout)
        return
      end
      
      while (total < timeout)
        sleep(interval);
        total += interval;
        begin 
          return if yield
        rescue Exception=>e 
          puts e
        end
      end          
    end
    
    #private :check_proxy, :is_ready?, :exec_command, :check_nil   
    
  end
  
  
  # This class is a stub representation of various elements on the browser
  # Most of the methods are implemented via method missing.
  #
  # All APIs available in Sahi are available in ruby. The full list is available here: http://sahi.co.in/w/browser-accessor-apis 
  #
  # Most commonly used action methods are:
  # click - for all elements
  # mouse_over - for all elements
  # focus - for all elements
  # remove_focus - for all elements
  # check - for checkboxes or radio buttons
  # uncheck - for checkboxes
  
  class ElementStub
    @@actions  = {"click"=>"click",
    "focus"=>"focus", "remove_focus"=>"removeFocus", 
    "check"=>"check", "uncheck"=>"uncheck", 
      "dblclick"=>"doubleClick", "right_click"=>"rightClick",
      "key_down"=>"keyDown", "key_up"=>"keyUp",
      "mouse_over"=>"mouseOver", "mouse_down"=>"mouseDown", "mouse_up"=>"mouseUp"}
    def initialize (browser, type,  identifiers)
      @type = type
      @browser  = browser      
      @identifiers = identifiers
    end
    
    def method_missing(m, *args, &block)  
      key = m.to_s
      if @@actions.key?(key)
        _perform(@@actions[key])
      end      
    end     
    
    def _perform(type)
      step = "_sahi._#{type}(#{self.to_s()})"
      @browser.execute_step(step)
    end

	# returns an array containing the values or texts of all options of the select box.
 	def options(type="text")
 		sahi_delimiter = "__SAHIDELIMITER__"
    	arr_string = @browser.fetch("_sahi._getOptions(#{self.to_s()}, #{Utils.quoted(type)}).join('" + sahi_delimiter + "')");
 		return arr_string.split(sahi_delimiter)   
    end
    
    # returns an array containing the values or texts of all options of the select box.
    def get_options(type="text")
 		sahi_delimiter = "__SAHIDELIMITER__"
    	arr_string = @browser.fetch("_sahi._getOptions(#{self.to_s()}, #{Utils.quoted(type)}).join('" + sahi_delimiter + "')");
 		return arr_string.split(sahi_delimiter)   
    end
	
	# simulates pressing a key on the given element.
	def key_press(codes, combo=nil)
		@browser.execute_step("_sahi._keyPress(#{self.to_s()}, #{codes.to_json}, #{combo.to_json})")
	end
	
    # drag element and drop on another element
    def drag_and_drop_on(el2)
      @browser.execute_step("_sahi._dragDrop(#{self.to_s()}, #{el2.to_s()})")
    end          

    # choose option in a select box
    def choose(val)
      @browser.execute_step("_sahi._setSelected(#{self.to_s()}, #{val.to_json})")
    end    	
      
    # sets the value for textboxes or textareas. Also triggers necessary events.
    def value=(val)
      @browser.execute_step("_sahi._setValue(#{self.to_s()}, #{Utils.quoted(val)})")
    end      
	
	# select text for manipulation
	
	def select_range(rangeStart, rangeEnd, type=nil)
	  if(type!= nil)
	  	@browser.execute_step("_sahi._selectRange(#{self.to_s()}, rangeStart, rangeEnd, #{Utils.quoted(type)})")
	  else
	    @browser.execute_step("_sahi._selectRange(#{self.to_s()}, #{rangeStart}, #{rangeEnd})")
	  end
	end  
	      
	def select_text_range(searchText, position=nil)
	  if(position != nil)
		@browser.execute_step("_sahi._selectTextRange(#{self.to_s()}, #{Utils.quoted(searchText)}, #{Utils.quoted(position)})")
	  else
	    @browser.execute_step("_sahi._selectTextRange(#{self.to_s()}, #{Utils.quoted(searchText)})")
	  end
	end
	
    # returns value of textbox or textareas and other relevant input elements
    def value()
      return @browser.fetch("_sahi._getValue(#{self.to_s()})")
    end 
    
    # fetches value of specified attribute
    def fetch(attr=nil)
	  if attr
		if attr.include? "."
			return @browser.fetch("#{self.to_s()}.#{attr}")
		else
			return @browser.fetch("_sahi.getAttribute(#{self.to_s()}, #{Utils.quoted(attr)})")
		end
	  else
			return @browser.fetch("#{self.to_s()}")
	  end
	end    
    
    # returns boolean value of attribute. returns true only if fetch returns "true"
    def fetch_boolean(attr=nil)
      return @browser.fetch_boolean(attr)
    end

    # Emulates setting filepath in a file input box. 
    def file=(val)
      @browser.execute_step("_sahi._setFile(#{self.to_s()}, #{Utils.quoted(val)})")
    end
    
    # returns inner text of any element
    def text()
      return @browser.fetch("_sahi._getText(#{self.to_s()})")
    end  
    
    # returns a two dimensional array of table cell data.
    def table_contents(columns=nil,rows=nil,count=nil)
    
    	passcolumnstring=""
    	if columns != nil
    		passcolumnstring=",["
		    columns.each do |j|
		    	if j.instance_of? String
		    		passcolumnstring=passcolumnstring+"\""+j+"\","
		    	else
		    		passcolumnstring=passcolumnstring.to_s+ j.to_s + ","
		    	end
		    end
		    passcolumnstring = passcolumnstring[0,passcolumnstring.length-1]+"]"
    	end
    	
    	passrowstring ="" 
    	if rows!=nil
    		if rows.instance_of? Array
    			passrowstring = ",["
    			rows.each do |i|
    			passrowstring = passrowstring+i.to_s+","
    			end
    			passrowstring = passrowstring[0,passrowstring.length-1]+"]"
    		elsif rows.instance_of? String
    			passrowstring = ","+rows.to_s
    		elsif rows.instance_of? Fixnum
    			passrowstring = ","+rows.to_s
    		end
    	end
    	
    	if count!=nil
    		passrowstring = passrowstring+","+count.to_s
    	end
    	fetchstring="_sahi.getTableContentsArray(#{self.to_s()}"+passcolumnstring+passrowstring+").join(\"_row_\")"
		arraystring = @browser.fetch(fetchstring)
		array1d=[]
		array2d=[]
		array1d = arraystring.split("_row_")
		array1d.each do |i|
     		array2d.push i.split("_column_")
     	end
    	return array2d
    end  
    
    # returns checked state of checkbox or radio button
    def checked?()
      return fetch("checked") == "true";
    end
    
    # returns selected text from select box
    def selected_text()
      return @browser.fetch("_sahi._getSelectedText(#{self.to_s()})")
    end

    # returns a stub with a DOM "near" relation to another element
    # Eg.
    #  browser.button("delete").near(browser.cell("User One")) will denote the delete button near the table cell with text "User One"
    def near(el2)
      @identifiers << ElementStub.new(@browser, "near", [el2])
      return self
    end

    # returns a stub with a DOM "in" relation to another element
    # Eg.
    #  browser.image("plus.gif").in(browser.div("Tree Node 2")) will denote the plus icon inside a tree node with text "Tree Node 2"
    def in(el2)
      @identifiers << ElementStub.new(@browser, "in", [el2])
      return self
    end

    # returns a stub with a POSITIONAL "under" relation to another element. 
    # Eg.
    #  browser.cell(0).under(browser.cell("Header")) will denote the cell visually under "Header"
    #  browser.cell(0).near(browser.cell("Book")).under(browser.cell("Cost")) may be used to denote the Cost of Book in a grid
    
    def under(el2, offset=nil, limit_under=nil)
      ar = (offset!=nil || limit_under!=nil) ? [el2, offset, limit_under] : [el2];
      @identifiers << ElementStub.new(@browser, "under", ar)
      return self
    end
    
    def above(el2, offset=nil, limit_under=nil)
      ar = (offset!=nil || limit_under!=nil) ? [el2, offset, limit_under] : [el2];
      @identifiers << ElementStub.new(@browser, "above", ar)
      return self
    end
    
    def above_or_under(el2, offset=nil, limit_under=nil)
      ar = (offset!=nil || limit_under!=nil) ? [el2, offset, limit_under] : [el2];
      @identifiers << ElementStub.new(@browser, "aboveOrUnder", ar)
      return self
    end
    
    def right_of(el2, offset=nil, limit_under=nil)
      ar = (offset!=nil || limit_under!=nil) ? [el2, offset, limit_under] : [el2];
      @identifiers << ElementStub.new(@browser, "rightOf", ar)
      return self
    end
    
    def left_of(el2, offset=nil, limit_under=nil)
      ar = (offset!=nil || limit_under!=nil) ? [el2, offset, limit_under] : [el2];
      @identifiers << ElementStub.new(@browser, "leftOf", ar)
      return self
    end
    
    def left_or_right_of(el2, offset=nil, limit_under=nil)
      ar = (offset!=nil || limit_under!=nil) ? [el2, offset, limit_under] : [el2];
      @identifiers << ElementStub.new(@browser, "leftOrRightOf", ar)
      return self
    end
    
    # specifies exacts coordinates to click inside an element. The coordinates are relative to the element. x is from left and y is from top. Can be negative to specify other direction
    # browser.button("Menu Button with Arrow on side").xy(-5, 10).click will click on the button, 5 pixels from right and 10 pixels from top.
    def xy(x, y)
      return ElementStub.new(@browser, "xy", [self, x, y])
    end
    
    # denotes the DOM parentNode of element.
    # If tag_name is specified, returns the parent element which matches the tag_name
    # occurrence finds the nth parent of a particular tag_name
    # eg. browser.cell("inner nested cell").parent_node("TABLE", 3) will return the 3rd encapsulating table of the given cell.
    def parent_node(tag_name="ANY", occurrence=1) 
      return ElementStub.new(@browser, "parentNode", [self]);
    end
  
    # returns true if the element exists on the browser
    def exists?(optimistic = false)
		return self.exists1?() if optimistic;
		(1..5).each do
			return true if self.exists1?();
		end
		return false;
    end
  
    def exists1?
      return "true".eql?(@browser.fetch("_sahi._exists(#{self.to_s()})"))
    end
      
    # returns true if the element exists and is visible on the browser
        def visible?(optimistic = false, checkZIndex = false, doScroll = false)
		return self.visible1?(checkZIndex, doScroll) if optimistic;
		(1..5).each do
			return true if self.visible1?(checkZIndex, doScroll);
		end
		return false;
    end
        
    def visible1?(checkZIndex = false, doScroll = false)
      return "true".eql?(@browser.fetch("_sahi._isVisible(#{self.to_s()}, #{(checkZIndex)}, #{(doScroll)})"))
    end
            
    # returns true if the element contains this text
    def contains_text?(text)
      return @browser.fetch("_sahi._containsText(#{self.to_s()}, #{Utils.quoted(text)})")
    end
          
    # returns true if the element contains this html
    def contains_html?(html)
      return @browser.fetch("_sahi._containsHTML(#{self.to_s()}, #{Utils.quoted(html)})")
    end
    
    # returns count of elements similar to this element
    def count_similar()
    	return Integer(@browser.fetch("_sahi._count(\"_#{@type}\", #{concat_identifiers(@identifiers).join(", ")})"))
    end
    
    # returns array elements similar to this element
    def collect_similar()
    	count = self.count_similar()
    	els = Array.new(count)
    	for i in (0..count-1)
    		copy = Array.new(@identifiers)
    		copy[0] = "#{copy[0]}[#{i}]"
    		els[i] = ElementStub.new(@browser, @type, copy);
    	end
    	return els
    end
                
    def to_s
      return "_sahi._#{@type}(#{concat_identifiers(@identifiers).join(", ") })"
    end
    
    def to_type
      return "_#{@type}"
    end
    
    def to_identifiers
      return "#{concat_identifiers(@identifiers).join(", ") }"
    end
    
    def concat_identifiers(ids)
      return ids.collect {|id| id.kind_of?(String) ? Utils.quoted(id) : (id.is_a?(ElementStub) ? id.to_s() : id.to_json())}
    end
    #private :concat_identifiers, :exists1?, :visible1?
  end
  
  class Utils
    def Utils.quoted(s)
      return "\"" + s.gsub("\\", "\\\\").gsub("\"", "\\\"") + "\""
    end
  end  
end
