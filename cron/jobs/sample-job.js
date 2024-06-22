const CronJob = require('cron').CronJob;

module.exports = function (cronConfig) {
    const job = new CronJob(cronConfig.time, async () => {
        try {
           // Logic lies here
        } catch (error) {
            throw error;
        }
    }, undefined, false, 'Asia/Kolkata');
    return job;
};