'use strict';

var $loginButton = $('.login-button');

$loginButton.on('click', function () {
  FirebaseAPI.setOnLoadingWindowChanged(function () {
    $('.loading-window').css('display', 'block');
  });
  FirebaseAPI.setOnChangeWindowChanged(function () {
    window.location.replace('/myChat');
  });

  FirebaseAPI.signIn();
});