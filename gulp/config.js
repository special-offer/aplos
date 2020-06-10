module.exports = {
  root: {
    src: './src'
  },
  tasks: {
    styles: {
      // Relative to root.src
      src: '/_styles',
      dest: '../dist/assets',
      filePattern: ['src/_styles/**/*.scss'],
      files: ['theme.scss'],
      // files: ['password.scss'],
      // files: ['checkout.scss'],
      // files: ['theme.scss', 'checkout.scss'],
      watchTask: 'styles',
      extensions: ['scss', 'css']
    },
    scripts: {
      src: '/_scripts',
      dest: '../dist/assets',
      extensions: ['js'],
      bundles: [{
        entries: 'theme.js',
        outputName: 'theme.js'
        // entries: 'password.js',
        // outputName: 'password.js'        
      }]  
      // bundles: [{
      //   entries: 'theme.js',
      //   outputName: 'theme.js'
      // }, {
      //   entries: 'checkout.js',
      //   outputName: 'checkout.js'
      // }]
    },
    eslint: {
      filePattern: ['gulpfile.js/**/*.js', 'src/_scripts/**/*.js'],
      extensions: ['js']
    }
  }
};
