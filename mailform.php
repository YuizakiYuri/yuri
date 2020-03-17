<?php

/*--------------------------------
  Script Name : Responsive Mailform
  Author : FIRSTSTEP
  Author URL : http://www.1-firststep.com/
  Create Date : 2014/3/25
  Version : 1.3.1
  Last Update 2015/11/29
--------------------------------*/


error_reporting(E_ALL);


mb_language('ja');
mb_internal_encoding('UTF-8');


require 'config.php';






$name_1 = '';
$name_2 = '';
$read_1 = '';
$read_2 = '';
$mail_address = '';
$mail_address_confirm = '';
$gender = '';
$postal = '';
$address_1 = '';
$address_2 = '';
$phone = '';
$kind_separated = '';
$mail_contents = '';


if( !(empty($_POST['name_1'])) ){
  $name_1 = mb_convert_kana($_POST['name_1'], 'KVa');
}
if( !(empty($_POST['name_2'])) ){
  $name_2 = mb_convert_kana($_POST['name_2'], 'KVa');
}


if( !(empty($_POST['read_1'])) ){
  $read_1 = mb_convert_kana($_POST['read_1'], 'KVa');
}
if( !(empty($_POST['read_2'])) ){
  $read_2 = mb_convert_kana($_POST['read_2'], 'KVa');
}


if( !(empty($_POST['mail_address'])) ){
  $mail_address = $_POST['mail_address'];
}
if( !(empty($_POST['mail_address_confirm'])) ){
  $mail_address_confirm = $_POST['mail_address_confirm'];
}

if( !(empty($_POST['mail_address'])) && !(empty($_POST['mail_address_confirm'])) ){

  if( !($mail_address === $mail_address_confirm) ){
    echo '<p>メールアドレスが一致しませんでした。</p>';
    exit;
  }

  if( !(preg_match("/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/", $mail_address)) ){
    echo '<p>正しくないメールアドレスです</p>。';
    exit;
  }
}


if( !(empty($_POST['gender'])) ){
  $gender = $_POST['gender'];
}


if( !(empty($_POST['postal'])) ){
  $postal = mb_convert_kana($_POST['postal'], 'a');
  $postal = str_replace(array(' ','-'), '', $postal);
}


if( !(empty($_POST['address_1'])) ){
  $address_1 = mb_convert_kana($_POST['address_1'], 'KVa');
}
if( !(empty($_POST['address_2'])) ){
  $address_2 = mb_convert_kana($_POST['address_2'], 'KVa');
}


if( !(empty($_POST['phone'])) ){
  $phone = mb_convert_kana($_POST['phone'], 'a');
}


if( !(empty($_POST['day'])) ){
  $day = mb_convert_kana($_POST['day'], 'as');
}


if( !(empty($_POST['product'])) ){
  $product = $_POST['product'];
}


if( !(empty($_POST['kind'])) ){
  foreach($_POST['kind'] as $key => $value){
    $kind[] = $_POST['kind'][$key];
  }
  $kind_separated = implode('、', $kind);
}


if( !(empty($_POST['mail_contents'])) ){
  $mail_contents = mb_convert_kana($_POST['mail_contents'], 'KVa');
}






$today = date('YmdHis');
$today_array[] = substr($today,0,4);
$today_array[] = substr($today,4,2);
$today_array[] = substr($today,6,2);
$today_array[] = substr($today,8,2);
$today_array[] = substr($today,10,2);
$today_array[] = substr($today,12,2);


$send_subject = 'Root-9メールフォーム';
$additional_headers = "From:".$mail_address;
$send_body = <<<EOM

メールフォームからお問い合わせがありました。
お問い合わせの内容は以下の通りです。

--------------------------------------------------------------------------

送信時刻：{$today_array[0]}年{$today_array[1]}月{$today_array[2]}日　{$today_array[3]}時{$today_array[4]}分{$today_array[5]}秒

お名前：{$name_1}
メールアドレス：{$mail_address}
WEBサイト：{$address_1}
依頼内容：{$product}
メール本文：
{$mail_contents}

--------------------------------------------------------------------------

EOM;


$my_result = mb_send_mail($send_address, $send_subject, $send_body, $additional_headers);






$thanks_subject = 'お問い合わせありがとうございました。';
$send_name = mb_encode_mimeheader($send_name, 'ISO-2022-JP');
$thanks_additional_headers = 'From:'.$send_name.' <'.$send_address.'>';
$thanks_body = <<<EOM
{$thanks_body_head}

---------------------------------------------------------------------------

送信時刻：{$today_array[0]}年{$today_array[1]}月{$today_array[2]}日　{$today_array[3]}時{$today_array[4]}分{$today_array[5]}秒

お名前：{$name_1}
メールアドレス：{$mail_address}
WEBサイト：{$address_1}
依頼内容：{$product}
メール本文：
{$mail_contents}

---------------------------------------------------------------------------


この度はお問い合わせを頂き、重ねてお礼申し上げます。

{$thanks_body_foot}

EOM;


$you_result = mb_send_mail($mail_address, $thanks_subject, $thanks_body, $thanks_additional_headers);

if($my_result && $you_result){
  header('Location: '.$thanks_page_url);
}else{
  echo '<p>エラーが起きました。<br />ご迷惑をおかけして大変申し訳ありません。</p>';
  exit;
}




?>
