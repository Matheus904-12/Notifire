// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAF1uzX8js4F4ZH86pA6TPNXJvsc1xmcV0",
  authDomain: "cadfire-c3467.firebaseapp.com",
  projectId: "cadfire-c3467",
  storageBucket: "cadfire-c3467.appspot.com",
  messagingSenderId: "767055740554",
  appId: "1:767055740554:web:86e6a5bace1fa542d27773",
  measurementId: "G-JJXS5EHFQR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
