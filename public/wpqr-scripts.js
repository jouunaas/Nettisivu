document.addEventListener('DOMContentLoaded', () => {
    // Load WPQR data when the page is loaded
    fetch('/api/wpqr', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => data.forEach(row => addRowWPQR(row)))
    .catch(error => console.error('Error loading WPQR data:', error));

    // Add a new row to the WPQR table
    document.getElementById('add-wpqr-row-button').addEventListener('click', () => {
        addRowWPQR({
            certificate: 'New Certificate',
            initials: 'New Initials',
            name: 'New Name',
            birthdate: 'New Birthdate',
            processId: 'New Process ID',
            remarks: 'New Remarks',
            validity: 'New Validity',
            employer: 'New Employer'
        });
    });

    // Save WPQR data
    document.getElementById('save-wpqr-btn').addEventListener('click', () => {
        saveDataWPQR();
    });
});

function addRowWPQR(data) {
    const tableBody = document.querySelector('#wpqr-table tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="checkbox"></td>
        <td><input type="text" value="${data.certificate}" /></td>
        <td><input type="text" value="${data.initials}" /></td>
        <td><input type="text" value="${data.name}" /></td>
        <td><input type="text" value="${data.birthdate}" /></td>
        <td><input type="text" value="${data.processId}" /></td>
        <td><input type="text" value="${data.remarks}" /></td>
        <td><input type="text" value="${data.validity}" /></td>
        <td><input type="text" value="${data.employer}" /></td>
    `;
    tableBody.appendChild(row);
}

function saveDataWPQR() {
    const rows = document.querySelectorAll('#wpqr-table tbody tr');
    const data = Array.from(rows).map(row => {
        const inputs = row.querySelectorAll('input');
        return {
            certificate: inputs[0].value,
            initials: inputs[1].value,
            name: inputs[2].value,
            birthdate: inputs[3].value,
            processId: inputs[4].value,
            remarks: inputs[5].value,
            validity: inputs[6].value,
            employer: inputs[7].value
        };
    });

    fetch('/api/wpqr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => alert(result.message))
    .catch(error => console.error('Error saving WPQR data:', error));
}
