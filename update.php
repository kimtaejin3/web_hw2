<?php
$id = $_GET['id'];
$title = $_GET['title'];
$content = $_GET['content'];
$file_name = $_GET["file_name"];
$category = $_GET["category"];

$myfile = fopen("mylists.json","r") or die("unable to open file!");

$array = array();

while(!feof($myfile)){
    $temp = fgets($myfile);
    $temp2 = json_decode($temp,true);
    if($temp2["id"] == $id ){
      $result = '{ "id":'.' "'.$id.'"'.", ".'"date":'.' "'.$temp2["date"].'"'.", ".'"order":'.' "'.$temp2["order"].'"'.", ".'"title":'.' "'.$title.'"'.", ".'"description":'.' "'.$content.'"'.", ".'"category":'.' "'.$category.'"'.", ".'"file_name":'.' "'.$file_name.'"'."}\n";
      array_push($array, $result);
    }
    else{
        array_push($array, $temp);
    }
}

$myfile = fopen("mylists.json","w") or die("unable to open file!");

foreach($array as $item){
    fwrite($myfile,$item);
}

?>
