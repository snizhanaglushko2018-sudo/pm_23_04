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
// Images
function images() {
    return gulp.src('src/app/imgs/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/imgs/'));
}
// BrowserSync
function serve() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch(paths.html.src, html);
    gulp.watch(paths.scss.src, styles);
    gulp.watch(paths.js.src, scripts);
}

// Build
const build = gulp.parallel(html, styles, scripts, images);

exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.build = build;
exports.default = gulp.series(build, serve);