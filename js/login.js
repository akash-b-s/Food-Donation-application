
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyAAbafVCD8yzGky2aKrq53PaOfa1sQxBOo",
  authDomain: "food-donation-app-5b462.firebaseapp.com",
  projectId: "food-donation-app-5b462",
  storageBucket: "food-donation-app-5b462.firebasestorage.app",
  messagingSenderId: "844839376958",
  appId: "1:844839376958:web:a1c4f8caf0fa549575996f",
  measurementId: "G-4C7TDYFF6C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('googleSignIn').addEventListener('click', () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log('User signed in with Google:', user);
      alert('Sign-in successful!');
      window.location.href = 'dashboard.html';  
    })
    .catch((error) => {
      console.error('Error during Google sign-in:', error.message);
      alert('Error signing in with Google: ' + error.message);
    });
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();  

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      
      const user = userCredential.user;
      console.log('User logged in with email:', user);
      
      window.location.href = 'dashboard.html';  
    })
    .catch((error) => {
    
      console.error('Error during email/password login:', error.code, error.message);
      alert('Error logging in: ' + error.message);
    });
});


onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is already signed in:', user);
  } else {
    console.log('No user is signed in.');
  }
});
