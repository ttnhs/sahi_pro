<?php

foreach (emu_getallheaders() as $name => $value) {
    echo "$name: $value</br>";
}
echo "Request Method : ".$_SERVER['REQUEST_METHOD']."</br>";
echo "Request URI : ".$_SERVER['REQUEST_URI']."</br>";
echo "Request Body : ".file_get_contents('php://input')."</br>";
echo "Query String : ".$_SERVER['QUERY_STRING']."</br>";

function emu_getallheaders() {
   foreach($_SERVER as $name => $value)
       if(substr($name, 0, 5) == 'HTTP_')
           $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
   return $headers;
}
?>