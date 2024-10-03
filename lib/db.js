import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL, // Make sure this is correct
});

// Function to connect to the database
export async function connectToDatabase() {
  if (!client._connected) {
    await client.connect();
  }
  return client;
}

// For executing queries
export const db = {
  query: async (text, params) => {
    const connection = await connectToDatabase(); // Ensure connection before querying
    return connection.query(text, params);
  },
};
