var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache'); 
var del = require('del');
var runSequence = require('run-sequence');


gulp.task('hello', function(){
   console.log('Allo Allo Gary');
});

gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss')
    .pipe(sass())// Converts Sass to CSS with gulp-sass
    //add .pipe(sass({
    //    outputStyle: 'compressed'
    //}))
    //for compressed sass files 
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
        stream: true
    }))
});

gulp.task('watch', ['browserSync', 'sass'], function(){
    gulp.watch('ap/scss/**/*.scss', ['sass']);
    //Reloads the browser whenever HTML or JS files are changed
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);

});

gulp.task('browserSync', function(){
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
});

gulp.task('useref', function(){
    return gulp.src('app/*.html')
    .pipe(useref())
    //minifies only if its a javascript file 
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
        interlaced: true
      })))
    .pipe(gulp.dest('dist/images'))
  });

gulp.task('fonts', function(){
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean:dist', function(){
    return del.sync('dist');
});

gulp.task('cache:clear', function(callback){
    return cache.clearAll(callback)
});

gulp.task('task')


//BUILD TASK
gulp.task('build',function(callback){
runSequence('clean:dist',
    ['sass', 'useref', 'images', 'fonts'],
    callback
    ) 
    console.log('Building Production Build')
});

//default task
gulp.task('default', function(callback){
    runSequence(['sass', 'browserSync', 'watch'],
    callback
    )
    console.log('Running Default Task')
});


