var CronJob = require('cron').CronJob;
var job = new CronJob({
    cronTime: '*/5 * * * * *',
    onTick: function () {
        console.log('job 1 ticked');
    },
    start: false,
    timeZone: 'Asia/Ho_Chi_Minh'
});
job.start();
console.log('job1 status', job.running); // job1 status true
