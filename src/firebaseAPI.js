const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const store = firebase.firestore();
const storage = firebase.storage();
const storageRef = firebase.storage().ref();


/**
 * 창이 바뀌어도 로그인 유지!
 */
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function () {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });


const settings = { timestampsInSnapshots: true };
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

const FirebaseDB = {
  createUser: async (user) => {
    let initial = '';
    _.forEach(user.displayName.split(' '), u => initial += u[0]);
    const data = {
      uid: user.uid,
      displayName: user.displayName,
      initial: initial,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date().getTime(),
      signAt: new Date().getTime(),
    };
    return await store.collection('users').doc(user.uid).set(data);
  },


  updateUser: async (user) => {
    let initial = '';
    _.forEach(user.displayName.split(' '), u => initial += u[0]);
    const data = {
      displayName: user.displayName,
      initial: initial,
      email: user.email,
      photoURL: user.photoURL,
      signAt: new Date().getTime(),
    };
    return await store.collection('users').doc(user.uid).update(data);
  },

  getUser: async (uid) => {
    const userRef = await store.collection('users').doc(uid);

    const doc = await userRef.get();
    if (doc.exists) return doc.data();
    else return null;
  },


  getUsers: async () => {

    const userList = [];
    await store.collection('users').get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        userList.push(doc.data());
      });

    });

    return userList;
  },


  putMessage: async (channel, user, message) => {
    const data = {
      date: new Date().getTime(),
      message: message,
      uid: user.uid,
      grade: user.grade,
      displayName: user.displayName
    };
    return await store.collection('chatting').doc(channel).collection('messages').doc(data.date + '').set(data);
  },

  getMessage: async (channel, date) => {
    let message = null;
    await store.collection('chatting').doc(channel).collection('messages').doc(date + '').get().then(function (doc) {
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
  },

  getMessages: async (channel) => {
    const chattingList = [];
    await store.collection('chatting').doc(channel).collection('messages').get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        chattingList.push(doc.data());
      });
      console.log(chattingList);
      return chattingList;
    }).catch(function () {
      console.log('getMessages Error');
    });
  },


  setGrade: async function (uid, grades) {
    if (!_.isNil(this.getUser(uid))) {
      try {
        await store.collection('users').doc(uid).update({ grade: grades });
        console.log('Grade successfully updated at users!');
        await store.collection('grade').doc(uid).set({ grade: grades });
        console.log('Grade successfully updated at grade!');
      } catch (e) {
        console.log('setGrade error', e);
      }
    }
    else console.log('There is no user to update grades');
  },
  setChannels: async function (uid, channels) {
    if (!_.isNil(this.getUser(uid))) {
      await store.collection('users').doc(uid).update({ channels: channels });
      console.log('Channels successfully updated at users!');

      await store.collection('channel').doc(uid).set({ channels: channels });
      console.log('Channels successfully updated at channel!');

    }
    else console.log('There is no user to update channels');

  },

  deleteMessage: (channel, date) => {
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
const FirebaseAPI = new function () {
  let authListener = null;
  let loadingWindowListener = null;
  let changeWindowListener = null;
  let messageAddListener = null;

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
    store.collection('chatting').doc(channel).collection('messages')
      .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          if (change.type === 'added') {
            if(!_.isNil(messageAddListener)) {
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
  auth.onAuthStateChanged(async (user) => {
    console.log('login:', user);
    if (_.isNil(user)) { // 로그인 안된상태
      if (!_.isNil(authListener)) authListener(null); // 로그인안됐고 처음 들어왔을때
      return;
    }

    if (!_.isNil(loadingWindowListener)) {
      loadingWindowListener();
    }

    let u = await FirebaseDB.getUser(user.uid); // 로그인된 유저 정보를 읽어옴
    if (_.isNil(u)) { // 처음 로그인할때
      await FirebaseDB.createUser(user);
      u = await FirebaseDB.getUser(user.uid);
    }
    else { // 재로그인
      await FirebaseDB.updateUser(user);
      u = await FirebaseDB.getUser(user.uid);
    }

    if (!_.isNil(authListener)) authListener(u);

    if (!_.isNil(changeWindowListener)) {
      changeWindowListener();
    }

  });







  return {
    signIn: async () => await auth.signInWithPopup(provider),
    signOut: async () => await auth.signOut(),
    setOnAuthStateChanged,
    setOnLoadingWindowChanged,
    setOnChangeWindowChanged,
    setObserver,
    setOnMessageAddListenerChanged,

  };
};


const test = async () => {
};
