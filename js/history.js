import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, get, remove } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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
  const donationsHistoryList = document.getElementById('donationsHistoryList');
  
  if (!donationsHistoryList) {
    console.error('Element with ID "donationsHistoryList" not found.');
    return;
  }

  const donationsRef = ref(db, 'donations/');

  get(donationsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const donations = snapshot.val();
        console.log('Fetched donations from Firebase:', donations); 

        const donationsArray = Object.keys(donations).map(key => ({
          key,
          ...donations[key]
        }));

        donationsArray.sort((a, b) => {
          if (a.claimed === b.claimed) {
            return 0;
          }
          return a.claimed ? 1 : -1;  
        });

        donationsArray.forEach((donation) => {
          const row = document.createElement('tr');
          
          row.innerHTML = `
            <td>${donation.foodItem}</td>
            <td>${donation.quantity}</td>
            <td>${donation.expiryDate}</td>
            <td class="${donation.claimed ? 'claimed' : 'not-claimed'}">${donation.claimed ? 'Claimed' : 'Not Claimed'}</td>
            <td><button class="removeButton">Remove</button></td>
          `;

          const removeButton = row.querySelector('.removeButton');
          removeButton.addEventListener('click', () => removeDonation(donation.key));

          donationsHistoryList.appendChild(row); 
        });
      } else {
        donationsHistoryList.innerHTML = '<tr><td colspan="5" class="no-donations">No donation history available.</td></tr>';
      }
    })
    .catch((error) => {
      console.error('Error fetching donations from Firebase: ', error);
    });

  const donationsHistory = JSON.parse(localStorage.getItem('donations')) || [];

  if (donationsHistory.length > 0) {
    donationsHistory.sort((a, b) => {
      if (a.status === b.status) {
        return 0;
      }
      return a.status === 'Not Claimed' ? -1 : 1;
    });

    donationsHistory.forEach((donation, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${donation.foodItem}</td>
        <td>${donation.quantity}</td>
        <td>${donation.expiryDate}</td>
        <td>${donation.status}</td>
        <td><button class="removeButton">Remove</button></td>
      `;

      const removeButton = row.querySelector('.removeButton');
      removeButton.addEventListener('click', () => removeLocalStorageDonation(index));

      donationsHistoryList.appendChild(row);
    });
  } else if (donationsHistoryList.innerHTML === '') {
    donationsHistoryList.innerHTML = '<tr><td colspan="5" class="no-donations">No donations available in localStorage.</td></tr>';
  }
});

function removeDonation(donationKey) {
  const donationRef = ref(db, 'donations/' + donationKey);

  remove(donationRef)
    .then(() => {
      location.reload();  
    })
    .catch((error) => {
      console.error('Error removing donation: ', error);
    });
}

function removeLocalStorageDonation(index) {
  const donationsHistory = JSON.parse(localStorage.getItem('donations')) || [];
  donationsHistory.splice(index, 1);  
  localStorage.setItem('donations', JSON.stringify(donationsHistory));

  location.reload();  
}
