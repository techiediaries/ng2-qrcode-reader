/* eslint-disable */
var gulp = require('gulp'),
  path = require('path'),
  ngc = require('@angular/compiler-cli/src/main').main,
  rollup = require('gulp-rollup'),
  del = require('del'),
  runSequence = require('run-sequence'),
  inlineResources = require('./tools/gulp/inline-resources');

// Import `compiler-cli` for the side-effect of setting up the internal `FileSystem`.
require('@angular/compiler-cli');

const rootFolder = path.join(__dirname);
const srcFolder = path.join(rootFolder, 'src');
const tmpFolder = path.join(rootFolder, '.tmp');
const buildFolder = path.join(rootFolder, 'build');
const distFolder = path.join(rootFolder, 'dist');

/**
 * 1. Delete /dist folder
 */
gulp.task('clean:dist', function () {
  return deleteFolders([distFolder]);
});

/**
 * 2. Clone the /src folder into /.tmp. If an npm link inside /src has been made,
 *    then it's likely that a node_modules folder exists. Ignore this folder
 *    when copying to /.tmp.
 */
gulp.task('copy:source', function () {
  return gulp.src([`${srcFolder}/**/*`, `!${srcFolder}/node_modules`])
    .pipe(gulp.dest(tmpFolder));
});

/**
 * 3. Inline template (.html) and style (.css) files into the the component .ts files.
 *    We do this on the /.tmp folder to avoid editing the original /src files
 */
gulp.task('inline-resources', function () {
  return Promise.resolve()
    .then(() => inlineResources(tmpFolder));
});



/**
 * 4. Run the Angular compiler, ngc, on the /.tmp folder. This will output all
 *    compiled modules to the /build folder.
 */
gulp.task('ngc', async function () {
  var exitCode =  ngc(['--project', `${tmpFolder}/tsconfig.es5.json`]);

  if (exitCode === 1) {
    // This error is caught in the 'compile' task by the runSequence method callback
    // so that when ngc fails to compile, the whole compile process stops running
    throw new Error('ngc compilation failed');
  }
  return exitCode;
});

/**
 * 5. Run rollup inside the /build folder to generate our Flat ES module and place the
 *    generated file into the /dist folder
 */
gulp.task('rollup', function () {
  return gulp.src(`${buildFolder}/**/*.js`)
  // transform the files here.
    .pipe(rollup({
      // any option supported by Rollup can be set here.
      entry: `${buildFolder}/index.js`,
      external: [
        '@angular/core',
        '@angular/common'
      ],
      format: 'es'
    }))
    .pipe(gulp.dest(distFolder));
});

/**
 * 6. Copy all the files from /build to /dist, except .js files. We ignore all .js from /build
 *    because with don't need individual modules anymore, just the Flat ES module generated
 *    on step 5.
 */
gulp.task('copy:build', function () {
  return gulp.src([`${buildFolder}/**/*`, `!${buildFolder}/**/*.js`])
    .pipe(gulp.dest(distFolder));
});

/**
 * 7. Copy package.json from /src to /dist
 */
gulp.task('copy:manifest', function () {
  return gulp.src([`${srcFolder}/package.json`])
    .pipe(gulp.dest(distFolder));
});

/**
 * 7.a. Copy README.MD from /src to /dist
 */
gulp.task('copy:readme', function () {
  return gulp.src([`${rootFolder}/README.MD`])
    .pipe(gulp.dest(distFolder));
});

/**
 * 8. Delete /.tmp folder
 */
gulp.task('clean:tmp', function () {
  return deleteFolders([tmpFolder]);
});

/**
 * 9. Delete /build folder
 */
gulp.task('clean:build', function () {
  return deleteFolders([buildFolder]);
});


gulp.task('compile', gulp.series('clean:dist','copy:source','inline-resources','ngc','rollup','copy:build','copy:manifest','copy:readme','clean:build','clean:tmp'));

/**
 * Watch for any change in the /src folder and compile files
 */
gulp.task('watch', function () {
  gulp.watch(`${srcFolder}/**/*`, ['compile']);
});

gulp.task('clean', gulp.series('clean:dist', 'clean:tmp', 'clean:build'));

gulp.task('build', gulp.series('clean', 'compile'));
gulp.task('build:watch', gulp.series('build', 'watch'));
gulp.task('default', gulp.series('build:watch'));

/**
 * Deletes the specified folder
 */
function deleteFolders(folders) {
  return del(folders);
}
