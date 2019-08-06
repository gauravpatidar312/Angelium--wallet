importScripts('https://www.gstatic.com/firebasejs/6.3.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.3/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '185609886814'
});
firebase.messaging();