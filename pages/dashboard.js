// pages/dashboard.js
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [weldingData, setWeldingData] = useState([]); // Proper use of useState

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
    <div>
      <h1>Welding Data</h1>
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