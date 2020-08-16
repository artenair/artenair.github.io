let mix = require('laravel-mix');

mix
    .js('src/js/index.js', 'dist/js/app.js')
    .sass('src/scss/resets.scss', 'dist/css/reset.css')
    .copy("src/images", "dist/images")
;
