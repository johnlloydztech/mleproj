import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyAzqviSWQkRTPguJCJxU-QnszzRlKJNp-Q",
    authDomain: "queuing-57020.firebaseapp.com",
    databaseURL: "https://queuing-57020-default-rtdb.firebaseio.com",
    projectId: "queuing-57020",
    storageBucket: "queuing-57020.appspot.com",
    messagingSenderId: "136468190970",
    appId: "1:136468190970:web:3d6efa3a8ca79959f29b43",
    measurementId: "G-K0NWVGM8D0"
};

const app = initializeApp(firebaseConfig);
export default app;
