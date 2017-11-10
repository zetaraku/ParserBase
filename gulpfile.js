const gulp = require('gulp');
const babel = require('gulp-babel');
const jade = require('gulp-pug');
const sass = require('gulp-sass');
// const jsdoc = require('gulp-jsdoc3');

gulp.task('default', ['babel','copyapp','libcopy','jade','scss']);

gulp.task('babel', () => {
	return gulp.src('./src/js/app/**/*.js')
		.pipe(babel())
		.pipe(gulp.dest('./dist/js/app/'));
});
gulp.task('copyapp', () => {
	return gulp.src('./src/app.js')
		.pipe(gulp.dest('./dist/'));
});
gulp.task('libcopy', () => {
	return gulp.src('./src/js/lib/*')
		.pipe(gulp.dest('./dist/js/lib/'));
});
gulp.task('jade', () => {
	return gulp.src('./src/**/*.jade')
		.pipe(jade({
			pretty: '\t'
		}))
		.pipe(gulp.dest('./dist/'))
});
gulp.task('scss', () => {
	return gulp.src('./src/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dist/css/'));
});
// gulp.task('doc', (cb) => {
// 	gulp.src(['README.md', './src/js/**/*.js'], {read: false})
// 		.pipe(jsdoc(cb));
// });
