import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAAbafVCD8yzGky2aKrq53PaOfa1sQxBOo",
  authDomain: "food-donation-app-5b462.firebaseapp.com",
  databaseURL: "https://food-donation-app-5b462-default-rtdb.firebaseio.com",
  projectId: "food-donation-app-5b462",
  storageBucket: "food-donation-app-5b462.appspot.com",
  messagingSenderId: "844839376958",
  appId: "1:844839376958:web:a1c4f8caf0fa549575996f",
  measurementId: "G-4C7TDYFF6C",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
  const donationsList = document.getElementById('donationsList');
  const donationsTableBody = document.querySelector('#donationsTable tbody');
  const donationsRef = ref(db, 'donations/');

  get(donationsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const donations = snapshot.val();
        console.log('Fetched donations:', donations);  
        Object.keys(donations).forEach((key) => {
          const donation = donations[key];
          if (!donation.claimed) {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${donation.foodItem}</td>
              <td>${donation.quantity}</td>
              <td>${donation.expiryDate}</td>
            `;
            donationsTableBody.appendChild(row);  
          }
        });
      } else {
        donationsTableBody.innerHTML = '<tr><td colspan="3" class="no-donations">No unclaimed food donations available at the moment.</td></tr>';
      }
    })
    .catch((error) => {
      console.error('Error fetching donations: ', error);
    });
});


function goBack() {
  window.location.href = 'dashboard.html';  
}

