// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// import {getAnalytics} from "firebase/analytics";
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: 'AIzaSyCDf64Kkbw4eyrkqVgZSS9lfcbBZob4yWc',
  authDomain: 'serenity-journal.firebaseapp.com',
  projectId: 'serenity-journal',
  storageBucket: 'serenity-journal.appspot.com',
  messagingSenderId: '29638863316',
  appId: '1:29638863316:web:da5a0a2b7e3e6712300e41',
  measurementId: 'G-ZDHC3CV5N8',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);

export default firebaseApp;
