<?php
    header('Content-type: text/html');
    header('Access-Control-Allow-Origin: *');
    $uri = 'http'. (!empty($_SERVER['HTTPS']) ? 's' : null) .'://'. $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    echo('<p>This information has come from <a href="' . $uri . '">' . $uri . '</a></p>');
?>