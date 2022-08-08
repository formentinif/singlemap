const gulp = require("gulp"),
  concat = require("gulp-concat"),
  clean = require("gulp-clean"),
  { series } = require("gulp");

function dist(callback) {
  callback();
}

function cleanDist() {
  return gulp.src("./dist/*", { read: false }).pipe(clean());
}

function copyDist() {
  return gulp.src("./src/index.html").pipe(gulp.dest("./dist/"));
}

function combineAppJs() {
  return (
    gulp
      .src([
        "./src/js/ol.js",
		"./src/js/app.js",
		"./src/js/map.js",
		"./src/js/tooltip.js",
		"./src/js/features.js",
        
      ])
      .pipe(concat("singlemap.js"))
      //.pipe(uglify())
      .pipe(gulp.dest("./dist/"))
  );
}

function combineCss() {
  return gulp
    .src([
      "./src/css/app.css",   
      "./src/css/ol.css",
    ])
    .pipe(concat("singlemap.css"))
    .pipe(gulp.dest("./dist/"));
}

function watchScripts(cb) {
  gulp.watch(["./src/**/*"], function (cb) {
    combineAppJs();
    combineCss();
    copyDist();
    cb();
  });
}

exports.default = dist;
exports.clean = cleanDist;
exports.copy = copyDist;
exports.scripts = series(combineAppJs, combineCss, copyDist);
exports.watch = watchScripts;