<?php

$myfile = fopen("mydeletelists.json","r") or die("unable to open file!");

$array = array();

while(!feof($myfile)){
    $temp = json_decode(fgets($myfile),true);
    array_push($array, $temp);
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($array);

?>
