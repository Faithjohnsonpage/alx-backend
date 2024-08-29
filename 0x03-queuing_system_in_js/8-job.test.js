import { expect } from 'chai';
import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';

describe('createPushNotificationsJobs', function() {
  let queue;

  before(function() {
    queue = kue.createQueue();
    queue.testMode.enter();
  });

  afterEach(function(done) {
    queue.testMode.clear();
    done();
  });

  after(function() {
    queue.testMode.exit();
  });

  it('display an error message if jobs is not an array', () => {
    const jobs = 'not_an_array';
    expect(() => createPushNotificationsJobs(jobs, queue)).to.throw('Jobs is not an array');
  });
});
