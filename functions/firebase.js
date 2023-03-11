const firebase = require('firebase-admin');

firebase.initializeApp();

const db = firebase.firestore();

exports.db = db;