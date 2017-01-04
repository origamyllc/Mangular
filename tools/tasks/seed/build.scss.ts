/**
 * Created by prashun on 11/1/16.
 */
import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as merge from 'merge-stream';
import * as autoprefixer from 'autoprefixer';
import * as cssnano from 'cssnano';
import {join} from 'path';
import Config from '../../config';
const plugins = <any>gulpLoadPlugins();

const processors = [
  autoprefixer({
    browsers: Config.BROWSER_LIST
  })
];

const isProd = Config.ENV === 'prod';

if (isProd) {
  processors.push(
    cssnano({
      discardComments: {removeAll: true}
    })
  );
}

export = () => merge(processComponentScss(), processExternalScss());

function processComponentScss() {
  return gulp.src([
    join(Config.APP_SRC, '**', '*.scss'),
    '!' + join(Config.APP_SRC, 'assets', '**', '*.scss')
  ])
    .pipe(plugins.sass(Config.SASS_OPTIONS))
    .pipe(isProd ? plugins.cached('process-component-css') : plugins.util.noop())
    .pipe(plugins.postcss(processors))
    .pipe(gulp.dest(isProd ? Config.TMP_DIR: Config.APP_DEST));
}

function processExternalScss() {
  return gulp.src([
    join(Config.APP_SRC, 'assets', '**', '*.scss')
  ])
    .pipe(plugins.sass(Config.SASS_OPTIONS))
    .pipe(isProd ? plugins.cached('process-external-css') : plugins.util.noop())
    .pipe(plugins.postcss(processors))
    .pipe(isProd ? plugins.concat(Config.CSS_PROD_BUNDLE) : plugins.util.noop())
    .pipe(gulp.dest(Config.CSS_DEST));
}
