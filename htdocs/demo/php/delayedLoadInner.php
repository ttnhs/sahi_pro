<?php
$t = empty($_GET['t']) ? 40 : intval($_GET['t']);
sleep($t);
?>
<div>Hi there!</div>
<span>Load after <?php echo $t; ?> seconds</span>
