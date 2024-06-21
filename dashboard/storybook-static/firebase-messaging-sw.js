/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyAXtUsSXmYwN1l9hHqqTGC1DOJxR7f4CKQ',
  authDomain: 'notifications-879e7.firebaseapp.com',
  projectId: 'notifications-879e7',
  storageBucket: 'notifications-879e7.appspot.com',
  messagingSenderId: '405734481012',
  appId: '1:405734481012:web:19d7ab3519f22a59724521',
  measurementId: 'G-FZ5X6EFBYG',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
