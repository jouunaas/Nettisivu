// pages/api/save.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Assuming you're saving JSON data
        const data = req.body;

        // Process the data (e.g., save it to a database or perform actions)
        console.log('Data received:', data);

        // Respond with a success message
        res.status(200).json({ message: 'Data saved successfully!', data });
    } else {
        // Handle any other HTTP methods (like GET)
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
