<?php
$datas = $_GET["datas"];
$datas_arr = json_decode($datas,true);

$myfile = fopen("mylists.json","w") or die("unable to open file!");

// 콘솔로 값 확인하고 싶을 때 arr이나 string 아닌거 var_dump!! 시험때 참고!
echo var_dump($datas_arr);

foreach($datas_arr as $item){
    $result = '{"id":'.' "'.$item['id'].'"'.", ".'"date":'.' "'.$item["date"].'"'.", ".'"order":'.' "'.$item["order"].'"'.", ".'"title":'.' "'.$item['title'].'"'.", ".'"description":'.' "'.$item['description'].'"'.", ".'"category":'.' "'.$item['category'].'"'.", ".'"file_name":'.' "'.$item['file_name'].'"'."}\n";
 
    fwrite($myfile,$result);
}

?>
