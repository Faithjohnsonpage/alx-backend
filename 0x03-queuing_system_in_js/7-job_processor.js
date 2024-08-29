const kue = require('kue');
const queue = kue.createQueue();

const blacklistedNumbers = ['4153518780', '4153518781'];

function sendNotification(phoneNumber, message, job, done) {
  for (let num of blacklistedNumbers) {
    if (num === phoneNumber) {
	  return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
	}
  }

  // Simulate a progress step
  job.progress(50, 100);
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  done();
}

queue.process('push_notification_code_2', (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});
