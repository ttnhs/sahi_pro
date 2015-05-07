<!DOCTYPE html>

<html>
<head>
<title>Display User Agent</title>
<style>
body{width: 960px; margin: 0 auto; background: #e7ebe9;
	font: 12px "Helvetica Neue", Helvetica, Arial, sans-serif;
	line-height: 18px; text-align: center;}
h3{color: #12A5F4; font-weight: 100;}
p{color:#000B4D;}
</style>
</head>

<body>
<h1>Sahi Test Page to Check User Agent</h1>
<h3> The User Agent which requested this page is:</h3>

<p id="useragent"><?php echo $_SERVER['HTTP_USER_AGENT']; ?></p>
</body>
</html>