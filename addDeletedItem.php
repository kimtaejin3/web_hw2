<?php
      $title= $_GET['title'];
      $content= $_GET['description'];
      $select= $_GET['category'];
      $file_name= $_GET['file_name'];
      $id= $_GET['id'];
      $date= $_GET['date'];
      $delete_time= $_GET['delete_time'];

      $myfile = fopen("mydeletelists.json","a") or die("unable to open file!");

      $result = '{"id":'.' "'.$id.'"'.", ".'"date":'.' "'.$date.'"'.",".'"title":'.' "'.$title.'"'.", ".'"description":'.' "'.$content.'"'.", ".'"category":'.' "'.$select.'"'.", ".'"file_name":'.' "'.$file_name.'"'.", ".'"delete_time":'.' "'.$delete_time.'"'."}\n";
      fwrite($myfile,$result);

      echo "hello";

?>