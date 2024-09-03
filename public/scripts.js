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
            // Hide login container and show main content
            document.getElementById('login-container').classList.add('hidden');
            document.getElementById('main-content').classList.remove('hidden');
        } else {
            // Display error message
            document.getElementById('login-error').textContent = 'Incorrect login details';
        }
    })
    .catch(error => console.error('Error logging in:', error));
});

document.getElementById('logout').addEventListener('click', function () {
    // Clear the token and reload the page
    localStorage.removeItem('jwtToken');
    window.location.reload();
});

document.getElementById('save-btn').addEventListener('click', function () {
    const rows = document.querySelectorAll('#job-table tbody tr');
    const data = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 1) { // Check if the row contains cells
            const rowData = {
                // Assuming column order based on your earlier HTML
                certificate: cells[1].textContent.trim(),
                initials: cells[2].textContent.trim(),
                name: cells[3].textContent.trim(),
                birthdate: cells[4].textContent.trim(),
                processId: cells[5].textContent.trim(),
                remarks: cells[6].textContent.trim(),
                validity: cells[7].textContent.trim(),
                employer: cells[8].textContent.trim()
            };
            data.push(rowData);
        }
    });

    // Log data to check structure
    console.log('Saving data:', data);

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
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        console.log('Save result:', result); // Log result to verify success
        alert('Data saved successfully!');
    })
    .catch(error => {
        console.error('Error saving data:', error);
        alert('An error occurred while saving data.');
    });
});

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const employer = document.getElementById('employer').value;
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;

    // Example of filtering rows based on search criteria
    const rows = document.querySelectorAll('#job-table tbody tr');
    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const cellEmployer = cells[8].textContent.toLowerCase();
        const cellFirstname = cells[2].textContent.toLowerCase(); // Assuming first name is in 3rd column
        const cellLastname = cells[3].textContent.toLowerCase();  // Assuming last name is in 4th column

        if (
            (employer === '' || cellEmployer.includes(employer.toLowerCase())) &&
            (firstname === '' || cellFirstname.includes(firstname.toLowerCase())) &&
            (lastname === '' || cellLastname.includes(lastname.toLowerCase()))
        ) {
            row.style.display = ''; // Show row
        } else {
            row.style.display = 'none'; // Hide row
        }
    });
});


// Function to add rows dynamically
function addRow(certificate, initials, name, birthdate, processId, remarks, validity, employer) {
    const tableBody = document.querySelector('#job-table tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="checkbox"></td>
        <td contenteditable="true">${certificate}</td>
        <td contenteditable="true">${initials}</td>
        <td contenteditable="true">${name}</td>
        <td contenteditable="true">${birthdate}</td>
        <td contenteditable="true">${processId}</td>
        <td contenteditable="true">${remarks}</td>
        <td contenteditable="true">${validity}</td>
        <td contenteditable="true">${employer}</td>
    `;
    tableBody.appendChild(row);
}

// Add initial rows
addRow('147811-02', 'FL 30', 'John Doe', '31.7.1974', '287-1 141 T BW 8/8 S/S', 'Good', '12/2024', 'ABC Corp');
addRow('147390-01', 'FL 17', 'Jane Doe', '9.1.1989', 'EN ISO 9606-1', 'Excellent', '06/2025', 'XYZ Ltd');

// Add a row when "Add Row" button is clicked
document.getElementById('add-row-button').addEventListener('click', function () {
    addRow('New Certificate', 'New Initials', 'New Name', 'New Birthdate', 'New Process ID', 'New Remarks', 'New Validity', 'New Employer');
});

document.getElementById('add-row-button').addEventListener('click', function() {
    document.getElementById('add-row-modal').classList.remove('hidden');
});

document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('add-row-modal').classList.add('hidden');
});

document.getElementById('add-row-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const certificate = document.getElementById('cert-input').value;
    const initials = document.getElementById('initials-input').value;
    const name = document.getElementById('name-input').value;
    const birthdate = document.getElementById('birthdate-input').value;
    const processId = document.getElementById('processid-input').value;
    const remarks = document.getElementById('remarks-input').value;
    const validity = document.getElementById('validity-input').value;
    const employer = document.getElementById('employer-input').value;

    const tableBody = document.querySelector('#job-table tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td><input type="checkbox"></td>
        <td>${certificate}</td>
        <td>${initials}</td>
        <td>${name}</td>
        <td>${birthdate}</td>
        <td>${processId}</td>
        <td>${remarks}</td>
        <td>${validity}</td>
        <td>${employer}</td>
    `;
    
    tableBody.appendChild(newRow);
    document.getElementById('add-row-modal').classList.add('hidden');
});
