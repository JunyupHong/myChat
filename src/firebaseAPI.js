const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const store = firebase.firestore();
const storage = firebase.storage();
const storageRef = firebase.storage().ref();

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


const settings = {timestampsInSnapshots: true};
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
    const data = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date().getTime(),
      signAt: new Date().getTime(),
    };
    return await store.collection('users').doc(user.uid).set(data);
  },

  updateUser: async (user) => {
    const data = {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      signAt: new Date().getTime(),

    };

    return await store.collection("users").doc(user.uid).update(data);

  },

  readUser: async (uid) => {
    const refUser = store.collection("users").doc(uid);

    const doc = await refUser.get();
    if (doc.exists) return doc.data();
    else return null;
  },

  getUser: async (uid) => {
    const docRef = store.collection("users").doc(uid);
    let user = null;
    await docRef.get().then(function (doc) {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        user = doc.data();
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });
    return user;
  },

  getUsers: async () => {

    const userList = [];
    await store.collection("users").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        userList.push(doc.data());
      });

    });

    return userList;
  },

  setGradeToUser: async function (uid, grade) {
    if (_.isNil(await this.getUser(uid))) {
      await store.collection("users").doc(uid).update({
        "grade": grade,
      }).then(function () {
        console.log("Document successfully updated!");
      });
    }
  },
  setChannelsToUser: async function (uid, channels) {
    if (_.isNil(await this.getUser(uid))) {
      await store.collection("users").doc(uid).update({
        "channels": channels,
      }).then(function () {
        console.log("Document successfully updated!");
      });
    }
  },

  putMessage: async (channel, user, message) => {
    const data = {
      date: new Date().getTime(),
      messsage: message,
      uid: user.uid,
      grade: user.grade,
      displayName: user.displayName
    };
    return await store.collection(channel).doc(data.date + "").set(data);
  },

  getMessage: async (channel, date) => {
    let message = null;
    await store.collection(channel).doc(date).get().then(function (doc) {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        message = doc.data();
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });
    return message;
  },
  getMessages: async (channel) => {
    const chattingList = [];
    await store.collection(channel).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        chattingList.push(doc.data());
      });

    });

    return chattingList;
  },

  deleteMessage: async (channel, date) => {

    await store.collection(channel).doc(date).delete().then(function () {
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  },

  uploadFileInfo: async (user, channel, file) => {

    const fileId = new Date().getTime().toString();

    const data = {
      uid: user.uid,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModifiedDate: file.lastModifiedDate,
      uploadDate: fileId
    };

    return await store.collection("files").doc(fileId).set(data);
  }
};


/**
 * listener
 */
const FirebaseAPI = new function () {
  let authListener = null;
  let loadingWindowListener = null;
  let changeWindowListener = null;
  let messageListener = [];

  function setOnAuthStateChanged(callback) {
    authListener = callback;
  }

  function setOnLoadingWindowChanged(callback) {
    loadingWindowListener = callback;
  }

  function setOnChangeWindowChanged(callback) {
    changeWindowListener = callback;
  }

  function setOnMessageListener(type, callback) {
    messageListener[type] = callback;
  }

  // firebase 내장 메소드(접속했을때, user가 변할때 불린다)
  auth.onAuthStateChanged(async (user) => {
    console.log('login:', user);
    if (_.isNil(user)) { // 로그인 안된상태
      if (!_.isNil(authListener)) authListener(null); // 로그인안됐고 처음 들어왔을때
      return;
    }

    if(!_.isNil(loadingWindowListener)) {
      loadingWindowListener();
    }

    let u = await FirebaseDB.readUser(user.uid); // 로그인된 유저 정보를 읽어옴
    if (_.isNil(u)) { // 처음 로그인할때
      await FirebaseDB.createUser(user);
      u = await FirebaseDB.readUser(user.uid);
    }
    else { // 재로그인
      await FirebaseDB.updateUser(user);
      u = await FirebaseDB.readUser(user.uid);
    }

    if (!_.isNil(authListener)) authListener(u);

    if(!_.isNil(changeWindowListener)) {
      changeWindowListener();
    }

  });


  return {
    signIn: async () => await auth.signInWithPopup(provider),
    signOut: async () => await auth.signOut(),
    setOnAuthStateChanged,
    setOnLoadingWindowChanged,
    setOnChangeWindowChanged,

  };
};