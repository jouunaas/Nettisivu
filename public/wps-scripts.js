document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/wps', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('wps-table').querySelector('tbody');
        data.forEach(wps => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${wps.id}</td>
                <td>${wps.process}</td>
                <td>${wps.weldType}</td>
                <td>${wps.baseMetal}</td>
                <td>${wps.fillerMetal}</td>
                <td>${wps.position}</td>
                <td>${wps.preheat}</td>
                <td>${wps.interpassTemp}</td>
                <td>${wps.postweldHeatTreatment}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error loading WPS data:', error));
});

document.getElementById('add-wps-button').addEventListener('click', () => {
    // Logic for adding a new WPS row (similar to addRow in scripts.js)
});
