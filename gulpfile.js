'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const imagemin = require('gulp-imagemin');

sass.compiler = require('node-sass');

gulp.task('images-optimize-jpg', () => {
    return gulp.src('./img/jpg/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./img/jpg'));
});

gulp.task('images-optimize-png', () => {
    return gulp.src('./img/png/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./img/png'));
});

gulp.task('images-optimize', gulp.series(
    'images-optimize-jpg',
    'images-optimize-png'
));

gulp.task('sass', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer({
                overrideBrowserslist: "last 100 versions"
            })
        ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());

});

// Starts a BrowerSync instance
gulp.task('default', gulp.series('sass', function(){
    browserSync.init({
        server: ".",
        port: 4000
    });

    gulp.watch("*.html").on("change", browserSync.reload);
    gulp.watch('./scss/**/*.scss', gulp.series('sass'));
}));