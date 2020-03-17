
$(function(){
  
  if( $('.essential').length ){
    var dt_essential = $('.essential').prev('dt');
    $('<span/>')
      .text('必須')
      .addClass('essential')
      .prependTo($(dt_essential));
  }
  
  
  
  
  $('#mail_submit_button').click(essential_check);
  
  
  
  
  function essential_check(){
    
    var name = true;
    var read = true;
    var mail = true;
    var confirm = true;
    var gender = true;
    var postal = true;
    var address = true;
    var phone = true;
    var day = true;
    var product = true;
    var kind = true;
    var contents = true;
    
    
    if( $('.essential').length ){
      
      if( $('.essential').children('input#name_1').length ){
        var element = $('.essential').children('input#name_1');
        if( element.val() == ''){
          element.nextAll('div').html('名前が入力されていません。');
          name = false;
        }else{
          element.nextAll('div').html('');
          name = true;
        }
      }
      
      
      if( $('.essential').children('input#read_1').length ){
        element = $('.essential').children('input#read_1');
        element2 = $('.essential').children('input#read_2');
        if( element.val() == '' && element2.val() == '' ){
          element.nextAll('div').html('ふりがなが入力されていません。');
          read = false;
        }else{
          element.nextAll('div').html('');
          read = true;
        }
      }
      
      
      if( $('.essential').children('input#mail_address').length ){
        var element = $('.essential').children('input#mail_address');
        if( element.val() == '' ){
          element.nextAll('div').html('メールアドレスが入力されていません。');
          mail = false;
        }else{
          if( !(element.val().match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/)) ){
            element.nextAll('div').html('正しいメールアドレスの書式ではありません。');
            mail = false;
          }else{
            element.nextAll('div').html('');
            mail = true;
          }
        }
      }
      
      
      if( $('.essential').children('input#mail_address_confirm').length ){
        var confirm_element = $('.essential').children('input#mail_address_confirm');
        var mail_element = $('input#mail_address');
        if( confirm_element.val() == '' ){
          confirm_element.nextAll('div').html('確認用のメールアドレスが入力されていません。');
          confirm = false;
        }else{
          if( mail_element.val() !== confirm_element.val() ){
            confirm_element.nextAll('div').html('メールアドレスが一致しません。');
            confirm = false;
          }else{
            if( !(confirm_element.val().match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/)) ){
              confirm_element.nextAll('div').html('正しいメールアドレスの書式ではありません。');
              confirm = false;
            }else{
              confirm_element.nextAll('div').html('');
              confirm = true;
            }
          }
        }
      }
      
      
      if( $('.essential').find('input#gender_1').length ){
        element = $('.essential').find('input#gender_1');
        element2 = $('.essential').find('input#gender_2');
        if( element.is(':checked') == '' && element2.is(':checked') == '' ){
          element.parents('dd').find('div').html('性別が選択されていません。');
          gender = false;
        }else{
          element.parents('dd').find('div').html('');
          gender = true;
        }
      }
      
      
      if( $('.essential').children('input#postal').length ){
        element = $('.essential').children('input#postal');
        if( element.val() == '' ){
          element.nextAll('div').html('郵便番号が入力されていません。');
          postal = false;
        }else{
          element.nextAll('div').html('');
          postal = true;
        }
      }
      
      
      if( $('.essential').children('input#address_1').length ){
        element = $('.essential').children('input#address_1');
        element2 = $('.essential').children('input#address_2');
        if( element.val() == '' && element2.val() == '' ){
          element.nextAll('div').html('住所が入力されていません。');
          address = false;
        }else{
          element.nextAll('div').html('');
          address = true;
        }
      }
      
      
      if( $('.essential').children('input#phone').length ){
        element = $('.essential').children('input#phone');
        if( element.val() == '' ){
          element.nextAll('div').html('電話番号が入力されていません。');
          phone = false;
        }else{
          element.nextAll('div').html('');
          phone = true;
        }
      }
      
      
      if( $('.essential').children('input#day').length ){
        element = $('.essential').children('input#day');
        if( element.val() == '' ){
          element.nextAll('div').html('ご希望の日時が入力されていません。');
          day = false;
        }else{
          element.nextAll('div').html('');
          day = true;
        }
      }
      
      
      if( $('.essential').children('select#product').length ){
        element = $('.essential').children('select#product');
        if( element.val() == '' ){
          element.nextAll('div').html('依頼内容が選択されていません。');
          product = false;
        }else{
          element.nextAll('div').html('');
          product = true;
        }
      }
      
      
      
      
      if( $('.essential').find('input#kind_1').length ){
        element = $('.essential').find('input#kind_1');
        element2 = $('.essential').find('input#kind_2');
        element3 = $('.essential').find('input#kind_3');
        element4 = $('.essential').find('input#kind_4');
        element5 = $('.essential').find('input#kind_5');
        if( element.is(':checked') == '' && element2.is(':checked') == '' && element3.is(':checked') == '' && element4.is(':checked') == '' && element5.is(':checked') == '' ){
          element.parents('dd').find('div').html('お問い合わせの種類が選択されていません。');
          kind = false;
        }else{
          element.parents('dd').find('div').html('');
          kind = true;
        }
      }
      
      
      if( $('.essential').children('textarea#mail_contents').length ){
        element = $('.essential').children('textarea#mail_contents');
        if( element.val() == '' ){
          element.nextAll('div').html('お問い合わせの内容が入力されていません。');
          contents = false;
        }else{
            element.nextAll('div').html('');
            contents = true;
        }
      }
	}
    
    if( name==true && read==true && mail==true && confirm==true && postal==true && day==true && product==true && address==true && phone==true && kind==true && contents==true ){
      if(window.confirm('送信してもよろしいですか？')){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  
  }
  
});
