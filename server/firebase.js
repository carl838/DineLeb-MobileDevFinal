const admin = require('firebase-admin');
const serviceAccount = require('./dinelab-firebase-adminsdk-fbsvc-f86a380dba.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
