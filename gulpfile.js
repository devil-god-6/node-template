const gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    compressor = require('node-minify'),
    spawn = require('child_process').spawn;
let node;

console.log('\x1b[32m', 'Starting Gulp!!');

/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', async function () {
    if (node) {
        node.kill();
    }
    process.env['TIMESTAMP'] = Math.round(new Date().getTime() / 1000);
    node = spawn('node', ['app.js'], {
        stdio: 'inherit'
    })
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
});

/**
 * $ gulp minifyjs
 * description: start the development environment
 */
gulp.task('minifyjs', async function () {
    const applicationFiles = [
        './public/js/pagewise/*.js',
    ];
    const applicationOutput = {
        combined: './public/js/application.js',
        minified: './public/js/application.min.js'
    };
    compressor.minify({
        compressor: 'no-compress',
        input: applicationFiles,
        output: applicationOutput.combined,
        callback: function (err, min) {
            if (!err) {
                console.log("\x1b[33mPagewise JS Concatenation done\x1b[0m");
            }
        }
    });
});

/**
 * $ gulp compress minifyjs
 * description: start the production environment
 */
gulp.task('compress_minifyjs', async function () {
    const applicationOutput = {
        combined: './public/js/application.js',
        minified: './public/js/application.min.js'
    };
    if (process.env['APP_ENV'] == 'production') {
        compressor.minify({
            compressor: 'gcc',
            options: {
                compilation_level: 'ADVANCED_OPTIMIZATIONS'
            },
            input: applicationOutput.combined,
            output: applicationOutput.minified,
            callback: function (err, min) {
                if (!err) {
                    console.log("\x1b[33mPagewise JS Compression done\x1b[0m");
                }
            }
        });
    } else {
        console.log("\x1b[33mUsing development environment.\nPagewise js compression cancel.\x1b[0m");
    }
});

/**
 * $ gulp watch
 * description: task watch in required files
 */
gulp.task('watch', async function () {

    gulp.watch([
        './public/js/common/*.js',
        './public/js/pagewise/*.js'
    ], gulp.parallel('minifyjs'));

    gulp.watch([
        './helpers/*.js',
        './common/*.js',
        './routes/**/*.js',
        './models/*.js',
        './config/*.js',
        './functions/*.js',
        './app.js',
        './services/*.js'
    ], gulp.parallel('server'));
});

gulp.task('default', gulp.series('minifyjs', 'compress_minifyjs', 'server', 'watch'));
gulp.task('only_minify', gulp.series('minifyjs', 'compress_minifyjs'));

// clean up if an error goes unhandled.
process.on('exit', function () {
    if (node) {
        node.kill();
    }
});
