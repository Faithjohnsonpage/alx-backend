import kue from 'kue';

const queue = kue.createQueue();

const job = queue.create('push_notification_code', {
  phoneNumber: '+2347487399',
  message: 'Take this time out to rest for the job next week',
}).save( function(err){
  if ( !err ) {
    console.log(`Notification job created: ${job.id}`);
  }  
});

job.on('complete', function(){
  console.log('Notification job completed');
}).on('failed', function(){
  console.log('Notification job failed');
});
