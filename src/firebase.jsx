import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBleVGNclfNYlt1bO_a4xVx9w5WpO_37Vc',
  authDomain: 'chatify-6b226.firebaseapp.com',
  projectId: 'chatify-6b226',
  storageBucket: 'chatify-6b226.appspot.com',
  messagingSenderId: '201396895311',
  appId: '1:201396895311:web:f79d42641f0b7caf50f43a',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app, 'gs://chatify-6b226.appspot.com');
export const db = getFirestore(app);
