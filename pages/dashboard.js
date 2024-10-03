import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [weldingData, setWeldingData] = useState([]);
  const [newWelding, setNewWelding] = useState({
    jobid: '',
    material: '',
    thickness: '',
    weldingtype: '',
    settings: '',
  });

  const fetchWeldingData = async () => {
    const response = await fetch('/api/welding');
    const data = await response.json();
    setWeldingData(data);
  };

  const handleAddWelding = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/welding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWelding),
    });

    if (response.ok) {
      fetchWeldingData(); // Refresh data
      setNewWelding({ jobid: '', material: '', thickness: '', weldingtype: '', settings: '' }); // Reset form
    }
  };

  const handleDeleteWelding = async (id) => {
    await fetch(`/api/welding/${id}`, {
      method: 'DELETE',
    });
    fetchWeldingData(); // Refresh data
  };

  useEffect(() => {
    fetchWeldingData();
  }, []);

  return (
    <div>
      <h1>Welding Dashboard</h1>
      <form onSubmit={handleAddWelding}>
        <input
          type="text"
          placeholder="Job ID"
          value={newWelding.jobid}
          onChange={(e) => setNewWelding({ ...newWelding, jobid: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Material"
          value={newWelding.material}
          onChange={(e) => setNewWelding({ ...newWelding, material: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Thickness"
          value={newWelding.thickness}
          onChange={(e) => setNewWelding({ ...newWelding, thickness: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Welding Type"
          value={newWelding.weldingtype}
          onChange={(e) => setNewWelding({ ...newWelding, weldingtype: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Settings"
          value={newWelding.settings}
          onChange={(e) => setNewWelding({ ...newWelding, settings: e.target.value })}
          required
        />
        <button type="submit">Add Welding Data</button>
      </form>
      <ul>
        {weldingData.map((welding) => (
          <li key={welding.id}>
            {welding.jobid} - {welding.material} - {welding.thickness} - {welding.weldingtype} - {welding.settings}
            <button onClick={() => handleDeleteWelding(welding.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
