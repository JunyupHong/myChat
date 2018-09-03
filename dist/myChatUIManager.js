'use strict';

var myChatUIManager = new function () {
  $('textarea').on('keyup keydown', function () {
    adjustHeight();
  });

  function adjustHeight() {
    var textEle = $('textarea');
    textEle[0].style.height = 'auto';
    var textEleHeight = textEle.prop('scrollHeight');
    textEle.css('height', textEleHeight);
  }

  var $logoutButton = $('.i.fas.fa-angle-down');
  $logoutButton.on('click', function () {
    FirebaseAPI.signOut();
    window.location.replace('/myChatLogin');
  });
}();