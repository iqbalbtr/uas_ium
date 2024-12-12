// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

const firebaseConfig = {    
  apiKey: "AIzaSyCA4xdEIqkHF2JHx0KplmVz0aI61sVErFw",
  authDomain: "empat-husada.firebaseapp.com",
  projectId: "empat-husada",
  storageBucket: "empat-husada.firebasestorage.app",
  messagingSenderId: "1095838304542",
  appId: "1:1095838304542:web:f0bf5c742127a1ba4b610f",
  measurementId: "G-PX2SZ5YVBG"
};


firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo.png',
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});