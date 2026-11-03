
const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');

const paths = {
    html: {
        src: 'src/*.html',
        dest: 'dist/'
    },
    scss: {
        src: 'src/app/scss/**/*.scss',
        dest: 'dist/css/'
    },
    js: {
        src: 'src/app/js/**/*.js',
        dest: 'dist/js/'
    }
};
// Bootstrap
const bootstrapPaths = {
    css: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
    js: 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
};
// HTML
function html() {
    return gulp.src(paths.html.src)
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream());
}

// SCSS
function styles() {
    return gulp.src(paths.scss.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(gulp.dest(paths.scss.dest))
        .pipe(browserSync.stream());
}

// JavaScript
function scripts() {
    return gulp.src(paths.js.src)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.stream());
}
// Copy Bootstrap CSS
function bootstrapCss() {
    return gulp.src(bootstrapPaths.css)
        .pipe(gulp.dest('dist/css/'));
}

// Copy Bootstrap JS
function bootstrapJs() {
    return gulp.src(bootstrapPaths.js)
        .pipe(gulp.dest('dist/js/'));
}
// Images
function images() {
    return gulp.src('src/app/imgs/**/*', { encoding: false })
        .pipe(imagemin())
        .pipe(gulp.dest('dist/imgs/'));
}

// BrowserSync
function serve() {
    browserSync.init({
        server: {
            baseDir: './dist'
        },
        browser: 'chrome'
    });

    gulp.watch(paths.html.src, html);
    gulp.watch(paths.scss.src, styles);
    gulp.watch(paths.js.src, scripts);
}

// Build
const build = gulp.parallel(
    html,
    styles,
    scripts,
    images,
    bootstrapCss,
    bootstrapJs
);

exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.build = build;
exports.default = gulp.series(build, serve);