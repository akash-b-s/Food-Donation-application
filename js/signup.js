import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js";

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
const analytics = getAnalytics(app);

const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User signed up: ', user);
      window.location.href = 'index.html'; 
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('Error during signup: ', errorCode, errorMessage);
      alert('Error during signup: ' + errorMessage);
    });
});
