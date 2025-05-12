import express from 'express';
import { createClient } from 'redis';
import kue from 'kue';

const app = express();
const port = 1245;

const queue = kue.createQueue();

const client = createClient();

client.on('error', (err) => {
  console.error('Redis client not connected to the server:', err);
});

client.on('ready', () => {
  console.log('Redis client connected to the server');
});

let reservationEnabled = true;

async function reserveSeat(number) {
  await client.set('available_seats', number);
}

async function getCurrentAvailableSeats() {
  const number = await client.get('available_seats');
  return number;
}

async function startServer() {
  try {
    await client.connect();
    
    // Initial seat reservation
    await reserveSeat(50);

    app.get('/available_seats', async (req, res) => {
      const currentSeats = await getCurrentAvailableSeats();
      res.json({ numberOfAvailableSeats: currentSeats });
    });

    app.get('/reserve_seat', (req, res) => {
      if (!reservationEnabled) {
        return res.json({ status: 'Reservation are blocked' });
      }

      const job = queue.create('reserve_seat', {}).save((err) => {
        if (err) {
          return res.json({ status: 'Reservation failed' });
        }
        res.json({ status: 'Reservation in process' });
      });

      job.on('complete', (result) => {
        console.log(`Seat reservation job ${job.id} completed`);
      });

      job.on('failed', (errorMessage) => {
        console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`);
      });
    });

    app.get('/process', async (req, res) => {
      res.json({ status: 'Queue processing' });

      queue.process('reserve_seat', async (job, done) => {
        const currentSeats = await getCurrentAvailableSeats();
        const availableSeats = Number(currentSeats);

        if (availableSeats <= 0) {
          reservationEnabled = false;
          return done(new Error('Not enough seats available'));
        }

        await reserveSeat(availableSeats - 1);

        if (availableSeats - 1 === 0) {
          reservationEnabled = false;
        }

        done();
      });
    });

    app.listen(port, () => {
      console.log(`API server listening on port ${port}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
