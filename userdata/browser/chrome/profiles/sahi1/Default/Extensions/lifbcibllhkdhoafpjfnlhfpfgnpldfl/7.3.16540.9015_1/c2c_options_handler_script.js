﻿'use strict';

// This method adds appropriate event handlers for each of the UI elements in the options menu
// Options menu is written in html in c2c_options_menu.html
function addEventHandlers() {
    document.addEventListener('DOMContentLoaded', function () {
        localizer.loadLocalizedResources();
        var switchHighlightElement = document.getElementById('switchHighlight');
        var helpElement = document.getElementById('help');
        switchHighlightElement.addEventListener('click', function() { switchHighlightHandler(switchHighlightElement.checked); });
        helpElement.addEventListener('click', function() { helpHandler(helpElement.href); });
    });
}

// Handle the switch on/off highlight event from UI
// Send the message to background script to store the settings
function switchHighlightHandler(onOffState) {
    var message = {};
    message.op = 'SET_SETTINGS_REQUEST';
    message.switchState = onOffState;
    chrome.extension.sendMessage(message);
}

// Sets the highlighting on/off check box state
function setSwitchState(message) {
    if ( message.switchState === false ) {
        document.getElementById("switchHighlight").checked = false;
    }
    else {
        document.getElementById("switchHighlight").checked = true;
    }
}

// Opens the help page
function helpHandler(helpUrl) {
    var message = {
        op: 'OPEN_HELP_REQUEST',
        helpUrl: helpUrl
    };
    chrome.extension.sendMessage(message);
}

function main() {

    // Add event handlers for UI elements
    addEventHandlers();

    // Update the settings displayed in the panel to match the stored settings
    chrome.extension.sendMessage({op: 'GET_SETTINGS_REQUEST'}, function(message) {
        setSwitchState(message);
    });
}

main();
