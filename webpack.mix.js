let mix = require('laravel-mix');

mix
    .js('src/js/index.js', 'dist/js/app.js')
    .copy("src/images", "dist/images")
;