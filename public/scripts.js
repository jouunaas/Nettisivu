const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');
const mainContent = document.getElementById('main-content');
const loginError = document.getElementById('login-error');
const apiUrl = process.env.API_URL;

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    try {
        const response = await fetch(`${apiUrl}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            loginError.textContent = errorData.message || 'Login failed';
            return;
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        loginContainer.classList.add('hidden');
        mainContent.classList.remove('hidden');
    } catch (error) {
        console.error('Error during login:', error);
        loginError.textContent = 'An error occurred. Please try again later.';
    }
});

// Add event listener to logout
const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        mainContent.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    });
}

// Function to handle adding job data to the database
async function addJobData(jobData) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${apiUrl}/api/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(jobData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error saving job data:', errorData.message);
            alert('Failed to save job data.');
            return;
        }

        alert('Job data saved successfully.');
    } catch (error) {
        console.error('Error during saving job data:', error);
        alert('An error occurred. Please try again later.');
    }
}
