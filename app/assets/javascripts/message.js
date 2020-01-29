$(function(){ 

    function buildHTML(message) {
  
      image = (message.image) ? `<img class= "lower-message__image" src=${message.image} >` : "";
  
      var html =
      // `<div class="message" data-message-id="${message.id}"> 
      //       <div class="upper-message">
      //         <div class="upper-message__user-name">
      //           ${message.user_name}
      //         </div>
      //         <div class="upper-message__date">
      //           ${message.date}
      //         </div>
      //       </div>
      //       <div class="lower-meesage">
      //         <p class="lower-message__content">
      //           ${message.content}
      //         </p>
      //         ${image}
      //       </div>
      //     </div>`
          `<div class="message" data-message-id="${message.id}">
            <div class="message_box">
              <div class="message_box__name">
              ${message.user_name}
              </div>
              <div class="message_box__date">
              ${message.date}
              </div>
            </div>
            <div class="message__title"></div>
            <p class="lower-message__content">
            ${message.content}
            </p>
            ${image}
          </div>`
      return html;
    }

    $('#new_message').on('submit', function(e){
      e.preventDefault();
      var formData = new FormData(this);
      var url = $(this).attr('action')
      $.ajax({
        url: url,
        type: "POST",
        data: formData,
        dataType: 'json',
        processData: false,
        contentType: false
      })
       .done(function(data){
         var html = buildHTML(data);
         $('.messages').append(html);      
         $('form')[0].reset();
         $('.message_list').animate({ scrollTop: $('.message_list')[0].scrollHeight});
         $('.submit-btn').prop('disabled', false);
       })
       .fail(function() {
         alert("メッセージ送信に失敗しました");
     })
    });

     var reloadMessages = function() {
      last_message_id = $('.message:last').data("message-id");
      $.ajax({
        url: "api/messages",
        type: 'get',
        dataType: 'json',
        data: {id: last_message_id}
      })
      .done(function(messages) {
        if (messages.length !== 0) {
          var insertHTML = '';
          $.each(messages, function(i, message) {
            insertHTML += buildHTML(message)
          });
          $('.message_list').append(insertHTML);
          $('.message_list').animate({ scrollTop: $('.message_list')[0].scrollHeight});
          $("#new_message")[0].reset();
          $(".form__submit").prop("disabled", false);
        }
      })
      .fail(function() {
        console.log('error');
      });
    };
    if (document.location.href.match(/\/groups\/\d+\/messages/)) {
      setInterval(reloadMessages, 7000);
    }
});
