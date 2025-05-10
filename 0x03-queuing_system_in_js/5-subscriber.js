import { createClient } from 'redis';

// Create Redis client
const client = createClient();

// Set up error handler for the main client
client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

// Set up connect handler for the main client
client.on('connect', () => {
  console.log("Redis client connected to the server");
});

// Create a duplicate client for subscription
const subscriber = client.duplicate();

// Set up the same handlers for the subscriber client
subscriber.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

subscriber.on('connect', () => {
  console.log("Redis client connected to the server");
});

async function main() {
  try {
    await subscriber.connect();
    
    await subscriber.subscribe('ALXchannel', (message) => {
      console.log(message);
      
      if (message === 'KILL_SERVER') {
        (async () => {
          await subscriber.unsubscribe('ALXchannel');
          await subscriber.quit();
          if (client.isOpen) {
            await client.quit();
          }
        })().catch(console.error);
      }
    });
  } catch (error) {
    console.error("Error:", error);
    try {
      if (subscriber.isOpen) {
        await subscriber.quit();
      }
      if (client.isOpen) {
        await client.quit();
      }
    } catch (e) {
      // Ignore any errors during cleanup
    }
  }
}

// Run the main function
main();
