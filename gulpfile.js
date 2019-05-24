const { src, dest, watch, parallel } =          require('gulp');
const sass =                                    require('gulp-sass');
const nodemon =                                 require('gulp-nodemon');
const cssnano  =                                require('gulp-cssnano');
const align =                                   require('gulp-align');

function sass2css(done) {
    src("./public/stylesheets/sass/app.sass")
        .pipe(sass().on('error', sass.logError))
        .pipe(dest("./public/stylesheets/css/"))

    done();

    src("./public/stylesheets/sass/signup.sass")
        .pipe(sass().on('error', sass.logError))
        .pipe(dest("./public/stylesheets/css/"))

    done();
}

function doNodemon(done) {
    nodemon({
        script: './bin/www'
        , ext: 'js pug'
        , env: { 'NODE_ENV': 'development' }
        , done: done
    })
}

function doCssNano(done) {
        src('./public/stylesheets/css/app.css')
            .pipe(cssnano())
            .pipe(dest('./public/stylesheets/css/dist'));
    
        done();

        src('./public/stylesheets/css/signup.css')
            .pipe(cssnano())
            .pipe(dest('./public/stylesheets/css/dist'));
    
        done();
}

function doAlign(done) {
    src('./controllers/*.js')
        .pipe(align())
        .pipe(dest('./controllers/'));

    done();

    src('./models/*.js')
        .pipe(align())
        .pipe(dest('./models/'));

    done();

    src('./passport/*.js')
        .pipe(align())
        .pipe(dest('./passport/'));

    done();

    src('./public/javascripts/*.js')
        .pipe(align())
        .pipe(dest('./public/javascripts/'));

    done();

    src('./routes/*.js')
        .pipe(align())
        .pipe(dest('./routes/'));

    done();

    src('./*.js')
        .pipe(align())
        .pipe(dest('./'));

    done();
}

watch("./public/stylesheets/sass/**/*.sass", sass2css);
watch("./public/stylesheets/css/*.css", doCssNano);

module.exports.default = parallel(sass2css, doCssNano, doNodemon);
module.exports.require = doAlign;