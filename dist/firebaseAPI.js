'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var auth = firebase.auth();
var provider = new firebase.auth.GoogleAuthProvider();
var store = firebase.firestore();
var storage = firebase.storage();
var storageRef = firebase.storage().ref();

/**
 * 창이 바뀌어도 로그인 유지!
 */
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function () {
  // Existing and future Auth states are now persisted in the current
  // session only. Closing the window would clear any existing state even
  // if a user forgets to sign out.
  // ...
  // New sign-in will be persisted with session persistence.
  return firebase.auth().signInWithEmailAndPassword(email, password);
}).catch(function (error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
});

var settings = { timestampsInSnapshots: true };
store.settings(settings);

/**
 *  storage 만들기!
 * */
// const FirebaseStorage = {
//   uploadFiles: async (files) => {
//     const user = auth.currentUser;
//     for (let i = 0; i < files.length; i++) {
//       const ref = storageRef.child(files[i].name).put(files[i]);
//     }
//   },
//
// };

var FirebaseDB = {
  createUser: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user) {
      var initial, data;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              initial = '';

              _.forEach(user.displayName.split(' '), function (u) {
                return initial += u[0];
              });
              data = {
                uid: user.uid,
                displayName: user.displayName,
                initial: initial,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: new Date().getTime(),
                signAt: new Date().getTime()
              };
              _context.next = 5;
              return store.collection('users').doc(user.uid).set(data);

            case 5:
              return _context.abrupt('return', _context.sent);

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    function createUser(_x) {
      return _ref.apply(this, arguments);
    }

    return createUser;
  }(),

  updateUser: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(user) {
      var initial, data;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              initial = '';

              _.forEach(user.displayName.split(' '), function (u) {
                return initial += u[0];
              });
              data = {
                displayName: user.displayName,
                initial: initial,
                email: user.email,
                photoURL: user.photoURL,
                signAt: new Date().getTime()
              };
              _context2.next = 5;
              return store.collection('users').doc(user.uid).update(data);

            case 5:
              return _context2.abrupt('return', _context2.sent);

            case 6:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    function updateUser(_x2) {
      return _ref2.apply(this, arguments);
    }

    return updateUser;
  }(),

  getUser: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(uid) {
      var userRef, doc;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return store.collection('users').doc(uid);

            case 2:
              userRef = _context3.sent;
              _context3.next = 5;
              return userRef.get();

            case 5:
              doc = _context3.sent;

              if (!doc.exists) {
                _context3.next = 10;
                break;
              }

              return _context3.abrupt('return', doc.data());

            case 10:
              return _context3.abrupt('return', null);

            case 11:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    function getUser(_x3) {
      return _ref3.apply(this, arguments);
    }

    return getUser;
  }(),

  getUsers: function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var userList;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              userList = [];
              _context4.next = 3;
              return store.collection('users').get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  // doc.data() is never undefined for query doc snapshots
                  userList.push(doc.data());
                });
              });

            case 3:
              return _context4.abrupt('return', userList);

            case 4:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    }));

    function getUsers() {
      return _ref4.apply(this, arguments);
    }

    return getUsers;
  }(),

  putMessage: function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(channel, user, message) {
      var data;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              data = {
                date: new Date().getTime(),
                message: message,
                uid: user.uid,
                grade: user.grade,
                displayName: user.displayName
              };
              _context5.next = 3;
              return store.collection('chatting').doc(channel).collection('messages').doc(data.date + '').set(data);

            case 3:
              return _context5.abrupt('return', _context5.sent);

            case 4:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, undefined);
    }));

    function putMessage(_x4, _x5, _x6) {
      return _ref5.apply(this, arguments);
    }

    return putMessage;
  }(),

  getMessage: function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(channel, date) {
      var message;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              message = null;
              _context6.next = 3;
              return store.collection('chatting').doc(channel).collection('messages').doc(date + '').get().then(function (doc) {
                if (doc.exists) {
                  console.log('Get message:', doc.data());
                  message = doc.data();
                } else {
                  // doc.data() will be undefined in this case
                  console.log('No such message!');
                }
                return message;
              }).catch(function (error) {
                console.log('Error getting message:', error);
              });

            case 3:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    }));

    function getMessage(_x7, _x8) {
      return _ref6.apply(this, arguments);
    }

    return getMessage;
  }(),

  getMessages: function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(channel) {
      var chattingList;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              chattingList = [];
              _context7.next = 3;
              return store.collection('chatting').doc(channel).collection('messages').get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  // doc.data() is never undefined for query doc snapshots
                  chattingList.push(doc.data());
                });
                console.log(chattingList);
                return chattingList;
              }).catch(function () {
                console.log('getMessages Error');
              });

            case 3:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, undefined);
    }));

    function getMessages(_x9) {
      return _ref7.apply(this, arguments);
    }

    return getMessages;
  }(),

  setGrade: function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(uid, grades) {
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              if (_.isNil(this.getUser(uid))) {
                _context8.next = 15;
                break;
              }

              _context8.prev = 1;
              _context8.next = 4;
              return store.collection('users').doc(uid).update({ grade: grades });

            case 4:
              console.log('Grade successfully updated at users!');
              _context8.next = 7;
              return store.collection('grade').doc(uid).set({ grade: grades });

            case 7:
              console.log('Grade successfully updated at grade!');
              _context8.next = 13;
              break;

            case 10:
              _context8.prev = 10;
              _context8.t0 = _context8['catch'](1);

              console.log('setGrade error', _context8.t0);

            case 13:
              _context8.next = 16;
              break;

            case 15:
              console.log('There is no user to update grades');

            case 16:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this, [[1, 10]]);
    }));

    function setGrade(_x10, _x11) {
      return _ref8.apply(this, arguments);
    }

    return setGrade;
  }(),
  setChannels: function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(uid, channels) {
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              if (_.isNil(this.getUser(uid))) {
                _context9.next = 9;
                break;
              }

              _context9.next = 3;
              return store.collection('users').doc(uid).update({ channels: channels });

            case 3:
              console.log('Channels successfully updated at users!');

              _context9.next = 6;
              return store.collection('channel').doc(uid).set({ channels: channels });

            case 6:
              console.log('Channels successfully updated at channel!');

              _context9.next = 10;
              break;

            case 9:
              console.log('There is no user to update channels');

            case 10:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    function setChannels(_x12, _x13) {
      return _ref9.apply(this, arguments);
    }

    return setChannels;
  }(),

  deleteMessage: function deleteMessage(channel, date) {
    store.collection('chatting').doc(channel).collection('messages').doc(date).delete().then(function () {
      console.log('Message successfully deleted!');
    }).catch(function (error) {
      console.error('Error delete message: ', error);
    });
  }
};

/**
 * listener
 */
var FirebaseAPI = new function () {
  var _this = this;

  var authListener = null;
  var loadingWindowListener = null;
  var changeWindowListener = null;
  var messageAddListener = null;

  function setOnAuthStateChanged(callback) {
    authListener = callback;
  }

  function setOnLoadingWindowChanged(callback) {
    loadingWindowListener = callback;
  }

  function setOnChangeWindowChanged(callback) {
    changeWindowListener = callback;
  }

  function setOnMessageAddListenerChanged(callback) {
    messageAddListener = callback;
  }

  function setObserver(channel) {
    store.collection('chatting').doc(channel).collection('messages').onSnapshot(function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        if (change.type === 'added') {
          if (!_.isNil(messageAddListener)) {
            console.log('New message: ', change.doc.data());
            messageAddListener(change.doc.data());
          }
        }
        if (change.type === 'modified') {
          console.log('Modified message: ', change.doc.data());
        }
        if (change.type === 'removed') {
          console.log('Removed message: ', change.doc.data());
        }
      });
    });
  }

  // firebase 내장 메소드(접속했을때, user가 변할때 불린다)
  auth.onAuthStateChanged(function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(user) {
      var u;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              console.log('login:', user);

              if (!_.isNil(user)) {
                _context10.next = 4;
                break;
              }

              // 로그인 안된상태
              if (!_.isNil(authListener)) authListener(null); // 로그인안됐고 처음 들어왔을때
              return _context10.abrupt('return');

            case 4:

              if (!_.isNil(loadingWindowListener)) {
                loadingWindowListener();
              }

              _context10.next = 7;
              return FirebaseDB.getUser(user.uid);

            case 7:
              u = _context10.sent;

              if (!_.isNil(u)) {
                _context10.next = 16;
                break;
              }

              _context10.next = 11;
              return FirebaseDB.createUser(user);

            case 11:
              _context10.next = 13;
              return FirebaseDB.getUser(user.uid);

            case 13:
              u = _context10.sent;
              _context10.next = 21;
              break;

            case 16:
              _context10.next = 18;
              return FirebaseDB.updateUser(user);

            case 18:
              _context10.next = 20;
              return FirebaseDB.getUser(user.uid);

            case 20:
              u = _context10.sent;

            case 21:

              if (!_.isNil(authListener)) authListener(u);

              if (!_.isNil(changeWindowListener)) {
                changeWindowListener();
              }

            case 23:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, _this);
    }));

    return function (_x14) {
      return _ref10.apply(this, arguments);
    };
  }());

  return {
    signIn: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return auth.signInWithPopup(provider);

              case 2:
                return _context11.abrupt('return', _context11.sent);

              case 3:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, _this);
      }));

      function signIn() {
        return _ref11.apply(this, arguments);
      }

      return signIn;
    }(),
    signOut: function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return auth.signOut();

              case 2:
                return _context12.abrupt('return', _context12.sent);

              case 3:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, _this);
      }));

      function signOut() {
        return _ref12.apply(this, arguments);
      }

      return signOut;
    }(),
    setOnAuthStateChanged: setOnAuthStateChanged,
    setOnLoadingWindowChanged: setOnLoadingWindowChanged,
    setOnChangeWindowChanged: setOnChangeWindowChanged,
    setObserver: setObserver,
    setOnMessageAddListenerChanged: setOnMessageAddListenerChanged

  };
}();

var test = function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, undefined);
  }));

  return function test() {
    return _ref13.apply(this, arguments);
  };
}();