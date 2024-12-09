
import { database, ref, set } from './firebase.js';

function generateUniqueId() {
  return 'donation_' + Date.now();
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#donationForm');

  form.addEventListener('submit', (event) => {
    event.preventDefault(); 
    const foodItem = document.querySelector('#foodItem').value.trim();
    const quantity = document.querySelector('#quantity').value.trim();
    const expiryDate = document.querySelector('#expiryDate').value.trim();

    if (!foodItem || !quantity || !expiryDate) {
      alert('All fields are required!');
      return;
    }
    console.log('Food Item:', foodItem);
    console.log('Quantity:', quantity);
    console.log('Expiry Date:', expiryDate);

    const donationId = generateUniqueId();

    const donation = {
      foodItem,
      quantity,
      expiryDate,
      claimed: false, 
    };

    const donationRef = ref(database, 'donations/' + donationId);

    set(donationRef, donation)
      .then(() => {
        alert('Donation added successfully!');
        form.reset(); 
      })
      .catch((error) => {
        console.error('Error saving donation to database:', error);
        alert('Failed to add donation. Please try again.');
      });
  });
});
