
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, get, set, remove, update } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
  const donationsList = document.getElementById('donationsList');

  if (!donationsList) {
    console.error('Element with ID "donationsList" not found.');
    return;
  }

  const donationsRef = ref(database, 'donations/');

  get(donationsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const donations = snapshot.val();

        Object.keys(donations).forEach((key) => {
          const donation = donations[key];
          if (!donation.claimed) {
            const div = document.createElement('div');
            div.classList.add('donation-item');
            div.innerHTML = `
              <p><strong>Food Item:</strong> ${donation.foodItem}</p>
              <p><strong>Quantity:</strong> ${donation.quantity}</p>
              <p><strong>Expiry Date:</strong> ${donation.expiryDate}</p>
              <p><strong>Status:</strong> ${donation.claimed ? 'Claimed' : 'Pending'}</p>
              <button class="claimButton" data-key="${key}">Claim</button>
              <hr>
            `;
            donationsList.appendChild(div);
          }
        });

        document.querySelectorAll('.claimButton').forEach(button => {
          button.addEventListener('click', () => {
            const donationKey = button.getAttribute('data-key');
            claimDonation(donationKey);  
          });
        });
      } else {
        donationsList.innerHTML = '<p>No donations available.</p>';
      }
    })
    .catch((error) => {
      console.error('Error fetching donations: ', error);
    });
});

function claimDonation(donationKey) {
  const donationRef = ref(database, `donations/${donationKey}`);

  get(donationRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const donation = snapshot.val();

        if (donation) {
          if (!donation.claimed) {
            donation.claimed = true;
            donation.status = 'claimed';  

            set(donationRef, donation)
              .then(() => {
                alert('Donation claimed successfully!');
                logHistory(donation); 
                removeDonationFromUI(donationKey); 
                window.location.href = 'history.html'; 
              })
              .catch((error) => {
                console.error('Error updating donation: ', error);
                alert('Error claiming donation.');
              });
          } else {
            alert('This donation has already been claimed.');
          }
        }
      } else {
        alert('Donation not found.');
      }
    })
    .catch((error) => {
      console.error('Error fetching donation: ', error);
      alert('Error fetching donation data.');
    });
}

function logHistory(donation) {
  let donationsHistory = JSON.parse(localStorage.getItem('donations')) || [];

  const existingDonation = donationsHistory.find(item => item.foodItem === donation.foodItem && item.expiryDate === donation.expiryDate);

  if (existingDonation) {
    existingDonation.status = 'claimed';
  } else {
    donationsHistory.push({
      foodItem: donation.foodItem,
      quantity: donation.quantity,
      expiryDate: donation.expiryDate,
      status: 'claimed',  
    });
  }

  localStorage.setItem('donations', JSON.stringify(donationsHistory));
}

function removeDonationFromUI(donationKey) {
  const donationRef = ref(database, `donations/${donationKey}`);

  remove(donationRef)
    .then(() => {
      console.log('Donation removed from Firebase.');
    })
    .catch((error) => {
      console.error('Error removing donation from Firebase: ', error);
    });
}
