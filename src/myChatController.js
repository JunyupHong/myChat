const myChatController = new function () {

  const $loadingWindow = $('.loading-window');
  let currentUser;
  let currentChannel;
  let messages = {};

  // $loadingWindow.css('display', 'block');


  FirebaseAPI.setOnAuthStateChanged(async (user) => {

    await FirebaseDB.setChannels(user.uid, ['general', 'web-class']);
    await FirebaseDB.setGrade(user.uid, ['admin']);

    currentUser = await FirebaseDB.getUser(user.uid);

    currentChannel = currentUser.channels[0];
    setChattingRoomName(currentChannel);
    setUserProfile(currentUser);
    setChattingRoomList(currentUser);
    await setMessages(currentUser);


    FirebaseAPI.setOnMessageAddListenerChanged((changeMessageData) => {
      appendMessage(changeMessageData);
    });

    FirebaseAPI.setObserver('general');

    // $loadingWindow.css('display', 'none');

  });

  const setUserProfile = (user) => {
    const $root = $('.left-header');

    let image = '';

    _.forEach(user.displayName.split(' '), name => {
      image = image + name[0];
    });

    $root.find('.header-image').text(image);
    $root.find('.header-name').text(user.displayName);
  };

  const setChattingRoomName = (chattingRoomName) => {
    $('.header-text').text(chattingRoomName);
  };

  const setChattingRoomList = (user) => {
    const channels = user.channels;
    const $root = $('.left-body-part');
    const $emptyPart = $(`<div class="empty-part"></div>`);
    const $headerTemplate = $(`<div class="header-part"> 채널(${channels.length})</div>`);

    $root.append($emptyPart);
    $root.append($headerTemplate);
    /**
     *  이 위에 itemTemplate를 설정하면 하나만 append가 된다...
     * */
    for (let i = 0; i < channels.length; i++) {
      const $itemTemplate = $(`<div class="item-part">
                                  <div class="item-private i fas fa-lock"></div>
                                  <div class="item-text">${channels[i]}</div>
                                  <div class="item-view i far fa-eye-slash show"></div>
                                  <div class="item-status i fas fa-sign-out-alt show"></div>
                                </div>`);

      $root.append($itemTemplate);
    }
  };


  const setMessages = async function(user) {
    const userChannels = user.channels;

    /**
     * Promise.all()로 바꾸기... 왜 안될까?
     */

    for (let i = 0; i < userChannels.length; i++) {

      // messages[userChannels[i]] = await FirebaseDB.getMessages(userChannels[i]+'');

      const chattingList = [];
      const b = await store.collection('chatting').doc('general').collection('messages').get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          chattingList.push(doc.data());
        });
        return chattingList;
      }).catch(function () {
        console.log('getMessages Error');
      });
      messages[userChannels[i]] = b;
    }

  };

  const putMessage = async (channel, user, message) => {
    await FirebaseDB.putMessage(channel, user, message);
  };

  const appendMessage = (messageData, beforeMessageData) => {
    const $root = $('.main-chatting');
    let $template;


    if (_.isNil(beforeMessageData) || messageData.uid !== beforeMessageData.uid) {
      let image = '';

      _.forEach(messageData.displayName.split(' '), name => {
        image = image + name[0];
      });

      const time = new Date(messageData.date);
      let ampm;
      if (time.getHours() / 13 === 0) ampm = '오전';
      else ampm = '오후';

      let date = `${ampm} ${time.getHours() % 12}시 ${time.getMinutes()}분`;
      if(time.getHours() === 12) date = `${ampm} ${time.getHours()}시 ${time.getMinutes()}분`;

      $template = $(`<div class="chat-content">
                              <div class="chat-image-zone">
                                  <div class="chat-image orange">${image}</div>
                              </div>
                              <div class="chat">
                                  <div class="chat-profile-content">
                                      <div class="profile-name">${messageData.displayName}</div>
                                      <div class="profile-owner-content">
                                          <div class="owner-text admin"></div>
                                          <div class="owner-text owner">Owner</div>
                                      </div>
                                      <div class="profile-date">${date}</div>
                                      <div class="i fas fa-cog"></div>
                                  </div>
                                  <div class="chat-text-content">${messageData.message}</div>
                              </div>
                            </div>`);

      if (messageData.grade === 'admin') {
        $template.find('.admin').text('Admin');
      }
    }

    else {
      $template = $(`<div class="chat-content">
                              <div class="chat-image-zone">
                                  <div class="chat-image"></div>
                                  <div class="i fas fa-cog"></div>
                              </div>
                              <div class="chat">
                                  <div class="chat-profile-content">
                                      <div class="profile-name"></div>
                                      <div class="profile-owner-content">
                                          <div class="owner-text admin"></div>
                                          <div class="owner-text owner"></div>
                                      </div>
                                      <div class="profile-date"></div>
                                  </div>
                                  <div class="chat-text-content">${messageData.message}</div>
                              </div>
                            </div>`);
    }
    $root.append($template);
  };

  // const appendMessages = (messages) => {
  //   const $root = $('.main-chatting');
  //   const currentMessages = messages[currentChannel];
  //   console.log('messagelength', currentMessages);
  //   for (let i = 0; i < currentMessages.length; i++) {
  //
  //     let $template;
  //     if (i > 0 && currentMessages[i].uid === currentMessages[i - 1].uid) {
  //       $template = $(`<div class="chat-content">
  //                             <div class="chat-image-zone">
  //                                 <div class="chat-image"></div>
  //                                 <div class="i fas fa-cog"></div>
  //                             </div>
  //                             <div class="chat">
  //                                 <div class="chat-profile-content">
  //                                     <div class="profile-name"></div>
  //                                     <div class="profile-owner-content">
  //                                         <div class="owner-text admin"></div>
  //                                         <div class="owner-text owner"></div>
  //                                     </div>
  //                                     <div class="profile-date"></div>
  //                                 </div>
  //                                 <div class="chat-text-content">${currentMessages[i].message}</div>
  //                             </div>
  //                           </div>`);
  //
  //     }
  //     else {
  //       let image = '';
  //
  //       _.forEach(currentMessages[i].displayName.split(' '), name => {
  //         image = image + name[0];
  //       });
  //
  //       const time = new Date(currentMessages[i].date);
  //       console.log(time, time.getHours(), time.getMinutes());
  //       console.log(new Date(currentMessages[i].date), new Date(currentMessages[i].date).getHours(), new Date(currentMessages[i].date).getMinutes());
  //       let ampm;
  //       if (time.getHours() / 13 === 0) ampm = '오전';
  //       else ampm = '오후';
  //
  //
  //       let date = `${ampm} ${time.getHours() % 12}시 ${time.getMinutes()}분`;
  //       if(time.getHours() === 12) date = `${ampm} ${time.getHours()}시 ${time.getMinutes()}분`;
  //
  //       $template = $(`<div class="chat-content">
  //                             <div class="chat-image-zone">
  //                                 <div class="chat-image orange">${image}</div>
  //                             </div>
  //                             <div class="chat">
  //                                 <div class="chat-profile-content">
  //                                     <div class="profile-name">${currentMessages[i].displayName}</div>
  //                                     <div class="profile-owner-content">
  //                                         <div class="owner-text admin"></div>
  //                                         <div class="owner-text owner">Owner</div>
  //                                     </div>
  //                                     <div class="profile-date">${date}</div>
  //                                     <div class="i fas fa-cog"></div>
  //                                 </div>
  //                                 <div class="chat-text-content">${currentMessages[i].message}</div>
  //                             </div>
  //                           </div>`);
  //
  //       if (currentMessages[i].grade === 'admin') {
  //         $template.find('.admin').text('Admin');
  //       }
  //     }
  //     $root.append($template);
  //
  //   }
  // };


  const $textarea = $('textarea');

  $textarea.on('keyup keydown', () => {
    adjustHeight();
  });

  function adjustHeight() {
    var textEle = $('textarea');
    textEle[0].style.height = 'auto';
    var textEleHeight = textEle.prop('scrollHeight');
    textEle.css('height', textEleHeight);
  }


  const $logoutButton = $('.i.fas.fa-power-off');
  $logoutButton.on('click', () => {
    FirebaseAPI.signOut();
    window.location.replace('/myChatLogin');
  });

  $textarea.on('keyup', async function (e) {
    const $this = $(this);
    if (e.keyCode === 13) {
      if ($this.val().trim() !== '') {
        await FirebaseDB.putMessage(currentChannel, currentUser, $this.val());
        // messages[currentChannel].push({
        //   displayName: currentUser.displayName,
        //   uid: currentUser.uid,
        //   message: $this.val(),
        //   date: new Date().getTime(),
        //   grade: currentUser.grade,
        //   appendMessage: (() => {
        //     if (messages[currentChannel].length === 1) appendMessage(messages[currentChannel][messages[currentChannel].length - 1]);
        //     else appendMessage(messages[currentChannel][messages[currentChannel].length - 1], messages[currentChannel][messages[currentChannel].length - 2]);
        //   })(),
        //   putMessage: (() => {
        //     putMessage(currentChannel, currentUser, $this.val());
        //   })()
        // });
      }
      $this.val('');
    }
  });

};
