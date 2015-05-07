/**
This is the script run when the browser starts up and is not associated
with any tab. Here we create a add-on icon in the add-on bar to display
the options.
*/

'use strict';

/**
* Returns the product version number
*
* @return Product version number
*/
var getProductVersion = function() {
    return "7.3.16540.9015";
}

/**
* Stores configuration information
*/
var Configuration = {
    fingerPrint : "0",
    metricsUrl : "",
    uiId : 0
};

/**
* Queries configuration information from PNR service
*/
var queryConfig = function() {
    if ( Configuration.metricsUrl !== "" ) {
        // We already have configuration information
        return;
    }

    var ajaxReq = new XMLHttpRequest();
    ajaxReq.onreadystatechange = function() {
        if (ajaxReq.readyState == 4 && ajaxReq.status == 200)
        {
            var jsonData = JSON.parse(ajaxReq.responseText);
            Configuration.fingerPrint = jsonData.fp;
            Configuration.metricsUrl = jsonData.metrics_url;
            Configuration.uiId = parseInt(jsonData.ui_id);
            
            // Ensure UI id is something we understand
            if(Configuration.uiId != 0 && Configuration.uiId != 1) {
                Configuration.uiId = 0;
            }
        };
    };

    ajaxReq.open("GET", "https://localhost:26143/skypectoc/v1/pnr/config", false);

    // Send the request
    ajaxReq.send();
}

/**
* Sends metrics data
*/
var postMetrics = function(event, userKVPs) {

    if ( event === "extension_state" ) {
        SkypeC2CTelemetry.post( Configuration.metricsUrl,
                        event,
                        false ,
                        {
                            Fingerprint: Configuration.fingerPrint,
                            UiId: Configuration.uiId.toString(),
                            ReferrerUrl: userKVPs.url,
                            Enabled: userKVPs.switchState ? "T" : "F"
                        }
        );
    } else if ( event === "help_page_click" ) {
        SkypeC2CTelemetry.post( Configuration.metricsUrl,
                        event,
                        false ,
                        {
                            Fingerprint: Configuration.fingerPrint,
                            UiId: Configuration.uiId.toString(),
                            ReferrerUrl: userKVPs.url
                        }
        );
    }
};

/**
* Main function where all the action starts
*/
var main = function() {

    // Register listener to receive messages
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

        if ( request.op == "GET_SETTINGS_REQUEST" ) {
            var message = {};
            message.switchState = JSON.parse(window.localStorage.getItem('switchState'));
            if ( message.switchState == null ) {
                message.switchState = true;
            }

            message.fingerPrint = Configuration.fingerPrint;
            message.metricsUrl = Configuration.metricsUrl;
            message.uiId = Configuration.uiId;

            sendResponse(message);
        }
        else if ( request.op == "SET_SETTINGS_REQUEST" ) {
            // Save the settings
            window.localStorage.setItem('switchState', request.switchState);
            
            // Inform all tabs about change in settings
            request.fingerPrint = Configuration.fingerPrint;
            request.metricsUrl = Configuration.metricsUrl;
            request.uiId = Configuration.uiId;

            chrome.tabs.query({}, function(tabs) {
                for (var i = 0; i < tabs.length; ++i) {
                    chrome.tabs.sendMessage(tabs[i].id, request);
                }
            });

            // Send metric
            chrome.tabs.query({active: true, lastFocusedWindow: true, windowType: "normal"}, function(tabs) {
                var data = {
                    switchState: request.switchState,
                    url: tabs[0].url.split("?")[0].split("#")[0]
                }
                postMetrics("extension_state", data);
            });
        }
        else if ( request.op == "OPEN_HELP_REQUEST" ) {
            chrome.tabs.query({active: true, lastFocusedWindow: true, windowType: "normal"}, function(tabs) {
                // Send metric
                var data = {
                    url: tabs[0].url.split("?")[0].split("#")[0]
                }
                postMetrics("help_page_click", data);
                
                // Open the help page
                window.open(request.helpUrl);
            });
        }
    });

    // Add icon to add-on bar
    chrome.browserAction.setTitle({title: "Skype Click to Call settings"});
    chrome.browserAction.setPopup({popup:"c2c_options_menu.html"});
    chrome.browserAction.setIcon({path:'c2c_48x48.png'});
    
    // Query configuration from PNR service
    queryConfig();
};

main();
