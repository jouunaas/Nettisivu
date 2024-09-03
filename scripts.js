document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send login request to the server
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Store the token in localStorage
            localStorage.setItem('jwtToken', data.token);
            document.querySelector('.login-container').classList.add('hidden');
            document.getElementById('excel-container').classList.remove('hidden');
        } else {
            alert('Incorrect login details');
        }
    })
    .catch(error => console.error('Error logging in:', error));
});

document.getElementById('save-btn').addEventListener('click', function () {
    const rows = document.querySelectorAll('#job-table tbody tr');
    const data = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = [];
        cells.forEach(cell => rowData.push(cell.textContent));
        data.push({
            jobId: rowData[0],
            material: rowData[1],
            thickness: rowData[2],
            weldingType: rowData[3],
            settings: rowData[4]
        });
    });

    // Save the data to the server
    const token = localStorage.getItem('jwtToken');
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Send token in the Authorization header
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {throw new Error(`Server error: ${err.message}`)});
        }
        return response.json();
    })
    .then(result => alert('Data saved successfully!'))
    .catch(error => {
        console.error('Error saving data:', error);
        alert('An error occurred while saving data.');
    });
});

// Add a new row to the table
document.getElementById('add-row-btn').addEventListener('click', function () {
    document.getElementById('add-row-form').classList.remove('hidden');
});

document.getElementById('cancel-add').addEventListener('click', function () {
    document.getElementById('add-row-form').classList.add('hidden');
});

document.getElementById('new-job-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const jobId = document.getElementById('new-job-id').value;
    const material = document.getElementById('new-material').value;
    const thickness = document.getElementById('new-thickness').value;
    const weldingType = document.getElementById('new-welding-type').value;
    const settings = document.getElementById('new-settings').value;
    
    if (jobId && material && thickness && weldingType && settings) {
        addRow(jobId, material, thickness, weldingType, settings);
        document.getElementById('new-job-form').reset();
        document.getElementById('add-row-form').classList.add('hidden');
    } else {
        alert('All fields are required!');
    }
});

function addRow(jobId, material, thickness, weldingType, settings) {
    const tableBody = document.querySelector('#job-table tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td contenteditable="true">${jobId}</td>
        <td contenteditable="true">${material}</td>
        <td contenteditable="true">${thickness}</td>
        <td contenteditable="true">${weldingType}</td>
        <td contenteditable="true">${settings}</td>
    `;
    tableBody.appendChild(row);
}

// Example of adding initial data
addRow('J001', 'Steel', '0.5in', 'MIG', 'Setting1');
addRow('J002', 'Aluminum', '1.0in', 'TIG', 'Setting2');
