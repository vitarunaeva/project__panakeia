var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var autoprefixer = require("autoprefixer");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var rename = require("gulp-rename");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var server = require("browser-sync").create();
var run = require("run-sequence");
var del = require("del");


gulp.task("style", function () {
    gulp.src("source/sass/style.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
       // .pipe(gulp.dest("source/css"))
        .pipe(gulp.dest("build/css"))
        .pipe(minify())
        .pipe(rename("style.min.css"))

        // .pipe(gulp.dest("source/css"));
        .pipe(gulp.dest("build/css"));
//        .pipe(server.stream());
});

gulp.task("html", function (){
    return gulp.src("source/*.html")
        .pipe(posthtml([
            include()
        ]))
        // .pipe(gulp.dest("source"));
        .pipe(gulp.dest("build"));
});

gulp.task("images", function(){
    return gulp.src("source/img/**/*.{png, jpg, svg}")
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.jpegran({progressive: true}),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest("source/img"));
});

gulp.task("webp", function() {
    return gulp.src("source/img/**/*.{png, jpg}")
        .pipe(webp({quality: 90}))
        .pipe(gulp.dest("source/img"));
});

gulp.task("sprite", function() {
    return gulp.src("source/img/icon-*.svg")
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        // .pipe(gulp.dest("source/img"));
        .pipe(gulp.dest("build/img"));
});

gulp.task("serve", function () {
    server.init({
        server: "build/"
    });

    gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
    gulp.watch("source/*.html", ["html"]);
});

// gulp.task("serve", ["style"], function () {
//     server.init({
//         server: "source/",
//         notify: false,
//         open: true,
//         cors: true,
//         ui: false
//     });
//
//     gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
//     gulp.watch("source/*.html").on("change", server.reload);
// });

gulp.task("build", function(done){
    run("clean", "copy","style", "sprite", "html", done);
});

gulp.task("copy", function() {
    return gulp.src([
        "source/fonts/**/*.{woff, woff2, ttf}",
        "source/img/**",
        "source/js/**"
    ], {
        base: "source"
    })
        .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
    return del("build");
});