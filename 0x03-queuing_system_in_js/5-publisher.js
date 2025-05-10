import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

client.on('ready', () => {
  console.log("Redis client connected to the server");
});

function publishMessage(message, time) {
  setTimeout(async () => {
    console.log(`About to send ${message}`);
    
    try {
      // Ensure client is connected before publishing
      if (!client.isOpen) {
        await client.connect();
      }
      
      // Publish to ALXchannel (matching the subscriber's channel name)
      await client.publish('ALXchannel', message);
    } catch (error) {
      console.error('Error publishing message:', error);
    }
  }, time);
}

(async () => {
  try {
    await client.connect();
    
    // Call the publishMessage function with the required messages and times
    publishMessage("ALX Student #1 starts course", 100);
    publishMessage("ALX Student #2 starts course", 200);
    publishMessage("KILL_SERVER", 300);
    publishMessage("ALX Student #3 starts course", 400);
    
    // Allow time for all messages to be sent before closing
    // Adding extra time to ensure all messages get processed
    setTimeout(async () => {
      await client.quit();
    }, 500);
    
  } catch (error) {
    console.error('Connection error:', error);
    try {
      await client.quit();
    } catch (e) {
      // Ignore errors during cleanup
    }
  }
})();
