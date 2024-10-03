// pages/dashboard.js
import { useEffect, useState } from 'react';
import { useTheme } from '../lib/ThemeContext'; // Import the useTheme hook

const Dashboard = () => {
    const { theme, toggleTheme } = useTheme(); // Get theme and toggleTheme from context
    const [weldingData, setWeldingData] = useState([]);

    useEffect(() => {
        const fetchWeldingData = async () => {
            const res = await fetch('/api/welding');
            if (res.ok) {
                const data = await res.json();
                setWeldingData(data);
            } else {
                console.error('Failed to fetch welding data:', res.statusText);
            }
        };

        fetchWeldingData();
    }, []);

    return (
        <div style={{ background: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}>
            <h1>Welding Data</h1>
            <button onClick={toggleTheme}>Toggle Theme</button>
            <ul>
                {weldingData.map((item) => (
                    <li key={item.id}>
                        {item.jobid} - {item.material} - {item.thickness} - {item.weldingtype}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
