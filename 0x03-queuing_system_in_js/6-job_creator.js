const kue = require('kue');
const queue = kue.createQueue();

const jobData = {
  phoneNumber: '1234567890',
  message: 'This is a test message'
};

const job = queue.create('push_notification_code', jobData).save((err) => {
  if (!err) {
    console.log('Notification job created:', job.id);
  } else {
    console.log('Error creating job:', err);
  }
});

job.on('complete', () => {
  console.log('Notification job completed');
}).on('failed', (errorMessage) => {
  console.log('Notification job failed:', errorMessage);
});
