var gulp = require('gulp');
var sftp = require('gulp-sftp');
var csv2json = require('gulp-csv2json');
var rename = require('gulp-rename');
var zip = require('gulp-zip');

gulp.task('deploy', () => {
    return gulp.src(['./dist/**/*', './index.html', './lb.html', './assets/images/**/*', './assets/fonts/*'], {base: '.'})
        .pipe(sftp({
            host: 'ftp.moore-interactive.net',
            auth: 'ftpcreds',
            remotePath: 'public_html/mooreslewt'
        }));
});

gulp.task('zip', () => {
    return gulp.src(['./dist', './dist/**/*', './assets', './assets/images/**/*', './assets/fonts/*', './index.html', './lb.html'], {base: '.'})
        .pipe(zip('moores_lewt.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('build-items', () => {

    var csvParseOptions = {}; //based on options specified here : http://csv.adaltas.com/parse/

    gulp.src('src/data/*.csv')
        .pipe(csv2json(csvParseOptions))
        .pipe(rename({extname: '.js'}))
        .pipe(gulp.dest('src/data'));
});
