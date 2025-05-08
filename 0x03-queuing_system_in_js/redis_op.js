import { createClient } from 'redis';

// Create Redis client
const client = createClient();

// Set up error handler
client.on('error', (err) => {
  console.log("Redis client not connected to the server:", err);
});

// Set up connect handler
client.on('ready', () => {
  console.log("Redis client connected to the server");
});

// Function to set a new school
async function setNewSchool(schoolName, value) {
  const reply = await client.set(schoolName, value);
  console.log('Reply:', reply);
}

// Function to display school value
async function displaySchoolValue(schoolName) {
  const reply = await client.get(schoolName);
  console.log(`${schoolName}: ${reply}`);
}

// Main function to run operations in sequence
async function main() {
  try {
    // Connect to Redis server first
    await client.connect();
    
    // Now run your operations
    await displaySchoolValue('ALX');
    await setNewSchool('ALXSanFrancisco', '100');
    await displaySchoolValue('ALXSanFrancisco');
    
    // Close the connection when done
    await client.quit();
  } catch (error) {
    console.error("Error:", error);
    // Try to close the client if it's still open
    try {
      await client.quit();
    } catch (e) {
      // Ignore errors on quit
    }
  }
}

// Run the main function
main();
