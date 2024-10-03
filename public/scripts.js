document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/login.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })         
    //.then(response => {
        //if (!response.ok) {
       //     return response.text().then(text => { throw new Error(`Network response was not ok: ${text}`); });
       // }
      //  return response.json();
   // })
    .then(data => {
        if (data.token) {
            localStorage.setItem('jwtToken', data.token);
            document.getElementById('login-container').classList.add('hidden');
            document.getElementById('main-content').classList.remove('hidden');
        } else {
            document.getElementById('login-error').textContent = 'Incorrect login details';
        }
    })
    .catch(error => {
        console.error('Error logging in:', error);
        document.getElementById('login-error').textContent = 'An error occurred. Please try again.';
    });
});

document.getElementById('logout').addEventListener('click', function () {
    localStorage.removeItem('jwtToken');
    window.location.reload();
});

async function login(username, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('Login successful:', data);
        // Handle successful login
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

document.getElementById('save-btn').addEventListener('click', function () {
    const rows = document.querySelectorAll('#job-table tbody tr');
    const data = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 1) {
            const rowData = {
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

    console.log('Saving data:', data);

    const token = localStorage.getItem('jwtToken');
    fetch('/api/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(`Network response was not ok: ${text}`); });
        }
        return response.json();
    })
    .then(result => {
        console.log('Save result:', result);
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

    const rows = document.querySelectorAll('#job-table tbody tr');
    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const cellEmployer = cells[8].textContent.toLowerCase();
        const cellFirstname = cells[2].textContent.toLowerCase();
        const cellLastname = cells[3].textContent.toLowerCase();

        if (
            (employer === '' || cellEmployer.includes(employer.toLowerCase())) &&
            (firstname === '' || cellFirstname.includes(firstname.toLowerCase())) &&
            (lastname === '' || cellLastname.includes(lastname.toLowerCase()))
        ) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

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

addRow('147811-02', 'FL 30', 'John Doe', '31.7.1974', '287-1 141 T BW 8/8 S/S', 'Good', '12/2024', 'ABC Corp');
addRow('147390-01', 'FL 17', 'Jane Doe', '9.1.1989', 'EN ISO 9606-1', 'Excellent', '06/2025', 'XYZ Ltd');

document.getElementById('add-row-button').addEventListener('click', function () {
    document.getElementById('add-row-modal').classList.remove('hidden');
});

document.getElementById('close-modal').addEventListener('click', function () {
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
