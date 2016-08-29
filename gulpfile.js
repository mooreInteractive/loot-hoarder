var gulp = require('gulp');
var sftp = require('gulp-sftp');
var csv2json = require('gulp-csv2json');
var rename = require('gulp-rename');

gulp.task('deploy', function () {
    return gulp.src(['./dist/**/*', './index.html', './lb.html', './assets/**/*'], {base: '.'})
        .pipe(sftp({
            host: 'ftp.moore-interactive.net',
            auth: 'ftpcreds',
            remotePath: 'public_html/js/loot/'
        }));
});

gulp.task('build-items', function () {

    var csvParseOptions = {}; //based on options specified here : http://csv.adaltas.com/parse/

    gulp.src('src/data/*.csv')
        .pipe(csv2json(csvParseOptions))
        .pipe(rename({extname: '.js'}))
        .pipe(gulp.dest('src/data'));
});
