Navigating to http://localhost.sahi.co.in/demo/401/index.htm should ask for username and password.

Setup: open .htaccess file (if not visible, make sure the setting to show hidden files is turned on in explorer folder view settings)

Change

#AuthUserFile "D:\Dev\Sahi\sahi_pro_g\htdocs\demo\401\passwd"
AuthUserFile "/home/tytosoft/.htpasswds/public_html/demo/401/passwd"

to

AuthUserFile "D:\Dev\Sahi\sahi_pro_g\htdocs\demo\401\passwd"
#AuthUserFile "/home/tytosoft/.htpasswds/public_html/demo/401/passwd"

and fix the actual path to passwd file (it is in this same folder)

Restart apache may be needed.

Navigating to http://localhost.sahi.co.in/demo/401/index.htm should ask for username and password.
username: testuser
password: password





