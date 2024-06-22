const schedule = require('./config/schedule');

const runCron = async function () {
    try {
        for (const iterator in schedule) {
            if (schedule[iterator].active) {
                require(`./jobs/${iterator}`)(schedule[iterator]).start();
            }
        };
        console.info(`=============== Cron Service Started  ===============`);
    } catch (error) {
        console.error(`=============== Cron Service failed ${error} ===============`);
    }
}

module.exports = runCron;