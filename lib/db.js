import { Client } from 'pg'; // Assuming you're using PostgreSQL

const client = new Client({
  connectionString: process.env.POSTGRES_URL, // Make sure this is correct
});

export async function connectToDatabase() {
  if (!client._connected) {
    await client.connect();
  }
  return client;
}

// For executing queries
export const db = {
  query: (text, params) => client.query(text, params),
};
