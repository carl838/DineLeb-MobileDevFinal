import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyASmdYP_S4jN16a_1aUZxNy1ZnmvqNLm0Y",
  authDomain: "dinelab.firebaseapp.com",
  projectId: "dinelab",
  storageBucket: "dinelab.firebasestorage.app",
  messagingSenderId: "1068028402162",
  appId:"1:1068028402162:web:2eed750f3ffe1781c6f36b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);