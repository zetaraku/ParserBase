const gulp = require('gulp');
const babel = require('gulp-babel');
const jade = require('gulp-pug');
const sass = require('gulp-sass');
// const jsdoc = require('gulp-jsdoc3');

gulp.task('default', ['babel','jade','scss']);

gulp.task('babel', () => {
	return gulp.src('./src/js/app/**/*.js')
		.pipe(babel())
		.pipe(gulp.dest('./js/app/'));
});
gulp.task('jade', () => {
	return gulp.src('./src/**/*.jade')
		.pipe(jade({
			pretty: '\t'
		}))
		.pipe(gulp.dest('./'))
});
gulp.task('scss', () => {
	return gulp.src('./src/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./css/'));
});
// gulp.task('doc', (cb) => {
// 	gulp.src(['README.md', './src/js/**/*.js'], {read: false})
// 		.pipe(jsdoc(cb));
// });
