if (process.version !== 'v18.18.1') {
    console.log('Node version must be v18.18.1');
    process.exit(1);
};

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const http = require('http');
const logger = require('morgan');

const mongoService = require('./services/database/mongo');

const { createdDirectoryIfNotExists } = require('./functions');

const config = require('./config');
const { passport, checkAuth } = require('./helpers/auth');
const { mCommon, errorHandler } = require('./helpers/middleware');


const runCron = require('./cron');

// normalize a port into a number, string, or false.
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (Number.isNaN(port) && port > 0) return val;
    if (port >= 0) return port;
    return false;
}

(async () => {

    await createdDirectoryIfNotExists('logs');

    await mongoService.connect();

    const port = normalizePort(process.env.APP_PORT || 2001);

    // Initialize express app
    const app = express();

    // app.use(function (req, res, next) {
    //     let requestIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.headers['HTTP_CLIENT_IP'] || req.headers['X-Real-IP'] || req.headers['HTTP_X_FORWARDED_FOR'];
    //     if (requestIP.substr(0, 7) === "::ffff:") {
    //         requestIP = requestIP.substr(7)
    //     };
    //     requestIP = requestIP.split(',');
    //     req.headers['x-forwarded-for'] = requestIP[0].trim();
    //     next();
    // });

    app.set('port', port);

    // HTTP server listener 'error' event.
    function onError(error, port) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        // eslint-disable-next-line no-undef
        const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    };

    const server = http.createServer(app);
    server.on('error', (error) => { onError(error, port) });


    app.use(session({
        name: 'sample',
        secret: config.session.secret,
        saveUninitialized: true,
        resave: true,
    }));

    //use connect flash 
    app.use(flash());

    app.use(express.json({
        limit: '100mb'
    }));

    app.use(express.urlencoded({
        extended: false,
        limit: '100mb'
    }));

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));

    const hbs = exphbs.create(require('./helpers/handlebar'));
    // view engine setup
    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');

    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/favicon.ico', (req, res) => {
        // TODO - send application fav icon
        res.end();
    });

    // attach passport middleware with express app
    passport(app);

    logger.token('ip', function (req, res) { return req.headers['x-forwarded-for'] })
    app.use(logger(':date[iso] | :ip | :method | :url | :status | :response-time ms'));


    // common middleware
    app.use(mCommon);

    // bind routes with app.
    app.use('/', require('./routes/index'));
    
    app.use(checkAuth);

    // Protected routes lies here


    app.use(errorHandler);

    server.listen(port, async () => {
        console.info(`App started on port ${port}`);
        await runCron();
    });
})();