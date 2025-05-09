import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => {
  console.log("Redis client not connected to the server:", err);
});

client.on('ready', () => {
  console.log("Redis client connected to the server");
});

async function main() {
  try {
    await client.connect();
    
    await client.hSet('ALX', {
      'Portland': 50,
      'Seattle': 80,
      'New York': 20,
      'Bogota': 20,
      'Cali': 40,
      'Paris': 2
    });

    const ALX = await client.hGetAll('ALX');
    console.log(JSON.stringify(ALX, null, 2));
    
    await client.quit();
  } catch (error) {
    console.error("Error:", error);
    try {
      await client.quit();
    } catch (e) {
      // Ignore errors on quit
    }
  }
}

main();
