const myChatUIManager = new function() {
  $('textarea').on('keyup keydown', () => {
    adjustHeight();
  });

  function adjustHeight() {
    var textEle = $('textarea');
    textEle[0].style.height = 'auto';
    var textEleHeight = textEle.prop('scrollHeight');
    textEle.css('height', textEleHeight);
  }



  const $logoutButton = $('.i.fas.fa-angle-down');
  $logoutButton.on('click', () => {
    FirebaseAPI.signOut();
    window.location.replace('/myChatLogin');
  });



};
