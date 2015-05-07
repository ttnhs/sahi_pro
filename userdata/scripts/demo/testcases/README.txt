Create a CSV file with the following columns:

Test Case Id, Script, Start URL, Tags

Additional columns can be added if necessary. 
Sahi, however will ignore these additional columns.

Eg.

Test Case Id,Description,Priority,Functionality,Release,Script,Tags,Start URL
TC_1,Login should work,H,Admin,1,training.sah," 'release one',medium,user",
TC_2,Add Books,M,User,1,training.sah,"low,user",
TC_3,Textarea double click should work,L,Reports,3,clicksTest.sah,"medium,admin",
TC_4,Events for IE work,H,User,2,checkbox_onchange.sah,"admin,low", 

To add a testcase in a script, use the _testcase(testcaseId, label) API

Eg.
var $t = _testcase("TC_1", "Login");
$t.start();
_setValue(_textbox("user"), "test");
_setValue(_password("password"), "secret");
_click(_submit("Login"));
$t.end();

NOTE: start() and end() should be used to demarcate the testcases.


Run your testcases:
Click on "Bin" link on the Sahi Dashboard.
Use this command to run the testcase.
drun demo/testcases/testcase_sample.csv http://sahi.co.in/demo/ ie "(admin||user)&&medium"

RESULTS:
Click on "DB Logs" on the dashboard
Results will be available here. 
Click to view reports.

On the navigation menu, 
**Click on "Test Cases Report" to view the testcases.
  Click on test case ids to navigate into the script where the testcase is located.

**Click on "Test Cases Report Summary" to view a reconciled report of the csv.