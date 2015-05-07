var schedulerFns = [ "_alert", "_assertEqual", "_assertEqualArrays",
		"_assertNotEqual", "_assertNotNull", "_assertNull", "_assertTrue",
		"_assert", "_assertNotTrue", "_assertFalse", "_assertExists",
		"_assertNotExists", "_callServer", "_click", "_clickLinkByAccessor",
		"_dragDrop", "_resetSavedRandom", "_setSelected", "_setValue",
		"_simulateEvent", "_call", "_eval", "_setGlobal", "_wait", "_popup",
		"_domain", "_highlight", "_log", "_navigateTo", "_doubleClick",
		"_rightClick", "_addMock", "_removeMock", "_expectConfirm", "_setFile",
		"_setFile2", "_expectPrompt", "_debug", "_debugToErr", "_debugToFile",
		"_mouseOver", "_keyPress", "_focus", "_keyDown", "_keyUp",
		"_mockImage", "_assertContainsText", "_enableKeepAlive",
		"_disableKeepAlive", "_dragDropXY", "_deleteCookie", "_createCookie",
		"_clearPrintCalled", "_saveDownloadedAs",
		"_clearLastDownloadedFileName", "_rteWrite", "_type", "_check",
		"_uncheck", "_blur", "_removeFocus", "_clearLastAlert",
		"_clearLastPrompt", "_clearLastConfirm", "_closeWindow",
		"_assertNotContainsText", "_simulateMouseEvent",
		"_simulateMouseEventXY", "_mouseDown", "_mouseUp",
		"_setStrictVisibilityCheck", "_assertSnapShot",
		"_setXHRReadyStatesToWaitFor", "_addToSession", "_startLookInside",
		"_stopLookInside", "_startHarLogging", "_stopHarLogging",
		"_openWindow", "_verifyLayout", "_findFramesForApplet" ];

function isSchedulerFunction(s) {
	for (var i=0; i<schedulerFns.length; i++) {
		if (s == schedulerFns[i]) return true;
	}
	return false;
}
