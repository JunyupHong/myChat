'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var myChatController = new function () {
  var _this = this;

  var $loadingWindow = $('.loading-window');
  var currentUser = void 0;
  var currentChannel = void 0;
  var messages = {};

  // $loadingWindow.css('display', 'block');


  FirebaseAPI.setOnAuthStateChanged(function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return FirebaseDB.setChannels(user.uid, ['general', 'web-class']);

            case 2:
              _context.next = 4;
              return FirebaseDB.setGrade(user.uid, ['admin']);

            case 4:
              _context.next = 6;
              return FirebaseDB.getUser(user.uid);

            case 6:
              currentUser = _context.sent;


              currentChannel = currentUser.channels[0];
              setChattingRoomName(currentChannel);
              setUserProfile(currentUser);
              setChattingRoomList(currentUser);
              _context.next = 13;
              return setMessages(currentUser);

            case 13:

              FirebaseAPI.setOnMessageAddListenerChanged(function (changeMessageData) {
                appendMessage(changeMessageData);
              });

              FirebaseAPI.setObserver('general');

              // $loadingWindow.css('display', 'none');

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());

  var setUserProfile = function setUserProfile(user) {
    var $root = $('.left-header');

    var image = '';

    _.forEach(user.displayName.split(' '), function (name) {
      image = image + name[0];
    });

    $root.find('.header-image').text(image);
    $root.find('.header-name').text(user.displayName);
  };

  var setChattingRoomName = function setChattingRoomName(chattingRoomName) {
    $('.header-text').text(chattingRoomName);
  };

  var setChattingRoomList = function setChattingRoomList(user) {
    var channels = user.channels;
    var $root = $('.left-body-part');
    var $emptyPart = $('<div class="empty-part"></div>');
    var $headerTemplate = $('<div class="header-part"> \uCC44\uB110(' + channels.length + ')</div>');

    $root.append($emptyPart);
    $root.append($headerTemplate);
    /**
     *  이 위에 itemTemplate를 설정하면 하나만 append가 된다...
     * */
    for (var i = 0; i < channels.length; i++) {
      var $itemTemplate = $('<div class="item-part">\n                                  <div class="item-private i fas fa-lock"></div>\n                                  <div class="item-text">' + channels[i] + '</div>\n                                  <div class="item-view i far fa-eye-slash show"></div>\n                                  <div class="item-status i fas fa-sign-out-alt show"></div>\n                                </div>');

      $root.append($itemTemplate);
    }
  };

  var setMessages = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(user) {
      var _this2 = this;

      var userChannels, _loop, i;

      return regeneratorRuntime.wrap(function _callee2$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              userChannels = user.channels;

              /**
               * Promise.all()로 바꾸기... 왜 안될까?
               */

              _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(i) {
                var chattingList, b;
                return regeneratorRuntime.wrap(function _loop$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:

                        // messages[userChannels[i]] = await FirebaseDB.getMessages(userChannels[i]+'');

                        chattingList = [];
                        _context2.next = 3;
                        return store.collection('chatting').doc('general').collection('messages').get().then(function (querySnapshot) {
                          querySnapshot.forEach(function (doc) {
                            // doc.data() is never undefined for query doc snapshots
                            chattingList.push(doc.data());
                          });
                          return chattingList;
                        }).catch(function () {
                          console.log('getMessages Error');
                        });

                      case 3:
                        b = _context2.sent;

                        messages[userChannels[i]] = b;

                      case 5:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _loop, _this2);
              });
              i = 0;

            case 3:
              if (!(i < userChannels.length)) {
                _context3.next = 8;
                break;
              }

              return _context3.delegateYield(_loop(i), 't0', 5);

            case 5:
              i++;
              _context3.next = 3;
              break;

            case 8:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee2, this);
    }));

    return function setMessages(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  var putMessage = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(channel, user, message) {
      return regeneratorRuntime.wrap(function _callee3$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return FirebaseDB.putMessage(channel, user, message);

            case 2:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee3, _this);
    }));

    return function putMessage(_x3, _x4, _x5) {
      return _ref3.apply(this, arguments);
    };
  }();

  var appendMessage = function appendMessage(messageData, beforeMessageData) {
    var $root = $('.main-chatting');
    var $template = void 0;

    if (_.isNil(beforeMessageData) || messageData.uid !== beforeMessageData.uid) {
      var image = '';

      _.forEach(messageData.displayName.split(' '), function (name) {
        image = image + name[0];
      });

      var time = new Date(messageData.date);
      var ampm = void 0;
      if (time.getHours() / 13 === 0) ampm = '오전';else ampm = '오후';

      var date = ampm + ' ' + time.getHours() % 12 + '\uC2DC ' + time.getMinutes() + '\uBD84';
      if (time.getHours() === 12) date = ampm + ' ' + time.getHours() + '\uC2DC ' + time.getMinutes() + '\uBD84';

      $template = $('<div class="chat-content">\n                              <div class="chat-image-zone">\n                                  <div class="chat-image orange">' + image + '</div>\n                              </div>\n                              <div class="chat">\n                                  <div class="chat-profile-content">\n                                      <div class="profile-name">' + messageData.displayName + '</div>\n                                      <div class="profile-owner-content">\n                                          <div class="owner-text admin"></div>\n                                          <div class="owner-text owner">Owner</div>\n                                      </div>\n                                      <div class="profile-date">' + date + '</div>\n                                      <div class="i fas fa-cog"></div>\n                                  </div>\n                                  <div class="chat-text-content">' + messageData.message + '</div>\n                              </div>\n                            </div>');

      if (messageData.grade === 'admin') {
        $template.find('.admin').text('Admin');
      }
    } else {
      $template = $('<div class="chat-content">\n                              <div class="chat-image-zone">\n                                  <div class="chat-image"></div>\n                                  <div class="i fas fa-cog"></div>\n                              </div>\n                              <div class="chat">\n                                  <div class="chat-profile-content">\n                                      <div class="profile-name"></div>\n                                      <div class="profile-owner-content">\n                                          <div class="owner-text admin"></div>\n                                          <div class="owner-text owner"></div>\n                                      </div>\n                                      <div class="profile-date"></div>\n                                  </div>\n                                  <div class="chat-text-content">' + messageData.message + '</div>\n                              </div>\n                            </div>');
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


  var $textarea = $('textarea');

  $textarea.on('keyup keydown', function () {
    adjustHeight();
  });

  function adjustHeight() {
    var textEle = $('textarea');
    textEle[0].style.height = 'auto';
    var textEleHeight = textEle.prop('scrollHeight');
    textEle.css('height', textEleHeight);
  }

  var $logoutButton = $('.i.fas.fa-power-off');
  $logoutButton.on('click', function () {
    FirebaseAPI.signOut();
    window.location.replace('/myChatLogin');
  });

  $textarea.on('keyup', function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(e) {
      var $this;
      return regeneratorRuntime.wrap(function _callee4$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              $this = $(this);

              if (!(e.keyCode === 13)) {
                _context5.next = 6;
                break;
              }

              if (!($this.val().trim() !== '')) {
                _context5.next = 5;
                break;
              }

              _context5.next = 5;
              return FirebaseDB.putMessage(currentChannel, currentUser, $this.val());

            case 5:
              $this.val('');

            case 6:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee4, this);
    }));

    return function (_x6) {
      return _ref4.apply(this, arguments);
    };
  }());
}();