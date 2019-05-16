const { src, dest, watch, parallel } = require('gulp');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');

function sass2css(done) {
    src("./public/stylesheets/sass/app.sass")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(dest("./public/stylesheets/css/"))

    done();
}

function doNodemon(done) {
    nodemon({
        script: 'index.js'
        , ext: 'js pug'
        , env: { 'NODE_ENV': 'development' }
        , done: done
    })
}

watch("./public/stylesheets/sass/**/*.sass", sass2css);

module.exports.default = parallel(sass2css, doNodemon);