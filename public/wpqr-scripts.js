document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/wpqr', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('wpqr-table').querySelector('tbody');
        data.forEach(wpqr => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${wpqr.id}</td>
                <td>${wpqr.weldingType}</td>
                <td>${wpqr.material}</td>
                <td>${wpqr.thickness}</td>
                <td>${wpqr.settings}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error loading WPQR data:', error));
});

document.getElementById('add-wpqr-button').addEventListener('click', () => {
    // Logic for adding a new WPQR row (similar to addRow in scripts.js)
});
