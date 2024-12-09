document.addEventListener('DOMContentLoaded', () => {
  const donations = JSON.parse(localStorage.getItem('donations')) || [];
  const tbody = document.querySelector('#collectedTable tbody');

  donations.forEach((donation) => {
    if (donation.status === 'claimed') { 
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${donation.foodItem}</td>
        <td>${donation.quantity}</td>
        <td>${donation.expiryDate}</td>
      `;
      tbody.appendChild(row);
    }
  });
});
