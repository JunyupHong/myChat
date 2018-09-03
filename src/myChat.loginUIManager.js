const $loginButton = $('.login-button');

$loginButton.on('click', () => {
  FirebaseAPI.setOnLoadingWindowChanged(() => {
    $('.loading-window').css('display', 'block');
  });
  FirebaseAPI.setOnChangeWindowChanged(() => {
    window.location.replace('/myChat');
  });

  FirebaseAPI.signIn();

});