<?php
header('Content-disposition: attachment; filename=Upload Template.pdf');
header('Content-type: application/pdf');
readfile('../testsaveas.pdf');
?>