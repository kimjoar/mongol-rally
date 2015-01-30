var _ = require('lodash');
var del = require('del');
var gulp = require('gulp');
var myth = require('gulp-myth');
var util = require('gulp-util');
var uuid = require('node-uuid');
var es6to5 = require('6to5ify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var template = require('gulp-template');
var reactify = require('reactify');
var watchify = require('watchify');
var Immutable = require('immutable');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var runSequence = require('run-sequence');

var id = uuid.v4().slice(0,8);

var paths = {
    html: {
        src: './static/index.html'
    },
    js: {
        src: './static/app.jsx',
        dest: 'bundle-' + id + '.js'
    },
    css: {
        all: './static/css/**/*.css',
        src: './static/app.css',
        dest: 'bundle-' + id + '.css'
    },
    dist: './dist'
};

var browserifyOpts = Immutable.Map({ from: paths.js.src, to: paths.js.dest, dist: paths.dist });
var watchifyOpts = browserifyOpts.set('watch', true);

// ---

gulp.task('default', ['build']);

gulp.task('build', ['clean'], function(cb) {
    runSequence(['build-html', 'build-css', 'build-js'], cb);
});

gulp.task('watch', ['clean'], function(cb) {
    runSequence(['watch-html', 'watch-css', 'watch-js'], cb);
});

gulp.task('build-js', browserifyTask(browserifyOpts.toJS()));
gulp.task('watch-js', browserifyTask(watchifyOpts.toJS()));

gulp.task('build-css', function () {
    return gulp.src(paths.css.src)
        .pipe(myth({ compress: true }))
        .pipe(rename(paths.css.dest))
        .pipe(gulp.dest(paths.dist));
});
gulp.task('watch-css', ['build-css'], function() {
    gulp.watch(paths.css.all, ['build-css']);
});

gulp.task('build-html', function () {
    return gulp.src(paths.html.src)
        .pipe(template({
            js: paths.js.dest,
            css: paths.css.dest
        }))
        .pipe(gulp.dest(paths.dist));
});
gulp.task('watch-html', ['build-html'], function() {
    gulp.watch(paths.html.src, ['build-html']);
});

gulp.task('clean', function(cb) {
    del([paths.dist], cb);
});

// ---

function browserifyTask(options) {
    options = options || {};

    var src = options.from;
    var dest = options.to;
    var dist = options.dist;
    var watch = options.watch || false;

    return function() {
        var bundler = browserify({
            cache: {}, packageCache: {}, fullPaths: true,
            entries: [src],
            extensions: ['.jsx'],
            debug: false
        })
        .transform(reactify)
        .transform(es6to5);

        if (watch) {
            bundler = watchify(bundler)
            .on("update", bundle)
            .on("log", function(message) {
                util.log("Browserify:", message);
            });
        }

        return bundle();

        function bundle() {
            return bundler.bundle()
                .on("error", function(error) {
                    util.log(util.colors.red("Error: "), error);
                })
                .on("end", function() {
                    util.log("Created:", util.colors.cyan(dest));
                })
                .pipe(source(dest))
                .pipe(streamify(uglify()))
                .pipe(gulp.dest(dist));
        };

    };
};

