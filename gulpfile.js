const gulp = require("gulp");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const execSync = require("child_process").execSync;
const { rimraf } = require("rimraf");
const replace = require("gulp-replace");
const fs = require("fs");
const crypto = require("crypto");

const formTemplateContent = fs.readFileSync("src/templates/form.html", "utf8");
const cssTemplateContent = fs.readFileSync("src/templates/styles.css", "utf8");

const sha384 = (str) => {
    const hash = crypto.createHash("sha384");
    const data = hash.update(str, "utf-8");
    return data.digest("base64");
};

const buildSriFromFile = (filepath) =>
    sha384(fs.readFileSync(filepath, "utf8"));

const paths = {
    index: [
        "node_modules/scrypt-async/scrypt-async.js",
        "src/passwordgeneration.js",
        "src/common-ui.js",
        "node_modules/argon2-browser/lib/argon2.js",
    ],
    hp: ["src/page/hp.js"],
    bookmarklet: [
        "node_modules/scrypt-async/scrypt-async.js",
        "src/passwordgeneration.js",
        "node_modules/argon2-browser/lib/argon2.js",
        "src/bookmarklet-ui.js",
        "src/bookmarklet.js",
    ],
};

gulp.task("clean-dist", function (cb) {
    return rimraf("dist/").then(() => cb());
});

gulp.task("clean", gulp.series("clean-dist"));

gulp.task("bookmarklet", function () {
    return gulp
        .src(paths.bookmarklet)
        .pipe(uglify())
        .pipe(concat("upb.min.js"))
        .pipe(gulp.dest("dist"));
});

gulp.task("index", function () {
    return gulp
        .src(paths.index)
        .pipe(uglify())
        .pipe(concat("upb-main.min.js"))
        .pipe(gulp.dest("dist"));
});

gulp.task("hp", function () {
    return gulp
        .src(paths.hp)
        .pipe(uglify())
        .pipe(concat("hp.min.js"))
        .pipe(gulp.dest("dist"));
});

gulp.task("argon2", function () {
    return gulp
        .src("node_modules/argon2-browser/dist/argon2-asm.min.js")
        .pipe(gulp.dest("dist"))
        .pipe(gulp.dest("addon"));
});

gulp.task("font-awesome-css", function () {
    return gulp
        .src("node_modules/font-awesome/css/*")
        .pipe(gulp.dest("dist/font-awesome/css"))
        .pipe(gulp.dest("addon/font-awesome/css"));
});

gulp.task("font-awesome-fonts", function () {
    return gulp
        .src("node_modules/font-awesome/fonts/*")
        .pipe(gulp.dest("dist/font-awesome/fonts"))
        .pipe(gulp.dest("addon/font-awesome/fonts"));
});

gulp.task(
    "font-awesome",
    gulp.series("font-awesome-css", "font-awesome-fonts")
);

gulp.task(
    "page-html",
    gulp.series("index", "hp", function () {
        var assetHash = buildSriFromFile("dist/upb-main.min.js");
        var hpHash = buildSriFromFile("dist/hp.min.js");

        return gulp
            .src("src/page/*.html")
            .pipe(replace("{TEMPLATE_HTML}", formTemplateContent))
            .pipe(replace("{TEMPLATE_CSS}", cssTemplateContent))
            .pipe(replace("{SRI_HASH}", `integrity="sha384-${assetHash}"`))
            .pipe(replace("{SRI_HP_HASH}", `integrity="sha384-${hpHash}"`))
            .pipe(
                replace(
                    "{COMMIT_HASH}",
                    execSync("git rev-parse HEAD").toString()
                )
            )
            .pipe(gulp.dest("dist"));
    })
);

gulp.task("addon-html", function () {
    return gulp
        .src("src/addon/*.html")
        .pipe(replace("{TEMPLATE_HTML}", formTemplateContent))
        .pipe(replace("{TEMPLATE_CSS}", cssTemplateContent))
        .pipe(gulp.dest("addon"));
});

gulp.task("assets", function () {
    return gulp.src("assets/*").pipe(gulp.dest("dist"));
});

gulp.task(
    "addon-copy-js",
    gulp.series("index", function () {
        return gulp.src(paths.index).pipe(gulp.dest("./addon"));
    })
);

gulp.task("addon", gulp.series("addon-html", "addon-copy-js"));

gulp.task("page", gulp.series("index", "assets", "page-html"));

gulp.task(
    "default",
    gulp.series("page", "bookmarklet", "addon", "argon2", "font-awesome")
);
