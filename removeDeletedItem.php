<?php
$id = $_GET['id'];

$myfile = fopen("mydeletelists.json","r") or die("unable to open file!");

$array = array();

while(!feof($myfile)){
    $temp = fgets($myfile);
    $temp2 = json_decode($temp,true);
    if($temp2["id"] != $id ){
        array_push($array, $temp);
    }
}

$myfile = fopen("mydeletelists.json","w") or die("unable to open file!");

foreach($array as $item){
    fwrite($myfile,$item);
}

?>
