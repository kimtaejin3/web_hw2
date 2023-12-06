<?php
      $title= $_GET['title'];
      $content= $_GET['description'];
      $select= $_GET['category'];
      $file_name= $_GET['file_name'];
      $id= $_GET['id'];
      $date= $_GET['date'];
      $order= $_GET['order'];

      $myfile = fopen("mydeletelists.json","a") or die("unable to open file!");

      fwrite($myfile,"\n");
      $result = '{"id":'.' "'.$id.'"'.", ".'"date":'.' "'.$date.'"'.", ".'"order":'.' "'.$order.'"'.", ".'"title":'.' "'.$title.'"'.", ".'"description":'.' "'.$content.'"'.", ".'"category":'.' "'.$select.'"'.", ".'"file_name":'.' "'.$file_name.'"'."}";
      fwrite($myfile,$result);

      echo "hello";

?>