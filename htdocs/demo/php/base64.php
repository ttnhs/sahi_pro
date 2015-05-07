<html>
<head><title>Base 64 Encoder</title></head>
<body>
<form>
Input: <input type="text" name="input">
<br/>
<input name="encode" type="submit" value="Encode"/> <input name="decode" type="submit" value="Decode"/>  
</form>
Output: 
<?php
if (isset($_REQUEST['input'])) {
	if (isset($_REQUEST['encode'])) {
		echo base64_encode($_REQUEST['input']);
	} else {
		echo base64_decode($_REQUEST['input']);
	}
}
?>
</body>
</html>
