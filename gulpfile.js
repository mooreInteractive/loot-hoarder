var gulp = require('gulp');
var sftp = require('gulp-sftp');

gulp.task('deploy', function () {
    return gulp.src(['./dist/**/*', './index.html', './assets/**/*'], {base: '.'})
        .pipe(sftp({
            host: 'ftp.moore-interactive.net',
            auth: 'ftpcreds',
            remotePath: 'public_html/js/loot/'
        }));
});
