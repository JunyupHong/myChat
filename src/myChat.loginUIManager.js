const $loginButton = $('.login-button');
const $loadingWindow = $('.loading-window');
$loginButton.on('click', async () => {
  FirebaseAPI.setOnLoadingWindowChanged(() => {
    // $loadingWindow.removeClass('display-none');
    // $loadingWindow.addClass('display-block');
    $loadingWindow.css('display', 'block');

  });
  FirebaseAPI.setOnChangeWindowChanged(async () => {
    await window.location.replace('/myChat');
  });

  await FirebaseAPI.signIn();

});
