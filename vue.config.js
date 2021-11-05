module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: 8080,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
  },
  configureWebpack: {
    module: {
      rules: [
        // three.js扩展库的使用
        // OrbitControls.js库的引用
        {
          test: require.resolve('three/examples/js/controls/OrbitControls'),
          use: 'imports-loader?THREE=three'
        },
        {
          test: require.resolve('three/examples/js/controls/OrbitControls'),
          use: 'exports-loader?THREE.OrbitControls'
        },
        // CSS2DRenderer
        {
          test: require.resolve('three/examples/js/renderers/CSS2DRenderer.js'),
          use: 'imports-loader?THREE=three'
        },
        {
          test: require.resolve('three/examples/js/renderers/CSS2DRenderer.js'),
          use: 'exports-loader?THREE.CSS2DRenderer'
        },
        // MTLLoader
        {
          test: require.resolve('three/examples/js/loaders/MTLLoader.js'),
          use: 'imports-loader?THREE=three'
        },
        {
          test: require.resolve('three/examples/js/loaders/MTLLoader.js'),
          use: 'exports-loader?THREE.MTLLoader'
        },
        // OBJLoader
        {
          test: require.resolve('three/examples/js/loaders/OBJLoader.js'),
          use: 'imports-loader?THREE=three'
        },
        {
          test: require.resolve('three/examples/js/loaders/OBJLoader.js'),
          use: 'exports-loader?THREE.OBJLoader'
        },
        // GLTFLoader
        {
          test: require.resolve('three/examples/js/loaders/GLTFLoader.js'),
          use: 'imports-loader?THREE=three'
        },
        {
          test: require.resolve('three/examples/js/loaders/GLTFLoader.js'),
          use: 'exports-loader?THREE.GLTFLoader'
        },
        // STLLoader
        {
          test: require.resolve('three/examples/js/loaders/STLLoader.js'),
          use: 'imports-loader?THREE=three'
        },
        {
          test: require.resolve('three/examples/js/loaders/STLLoader.js'),
          use: 'exports-loader?THREE.STLLoader'
        },
        {
          test: require.resolve('three/examples/js/objects/Water.js'),
          use: 'imports-loader?THREE=three'
        },
        {
          test: require.resolve('three/examples/js/objects/Water.js'),
          use: 'exports-loader?THREE.Water'
        },
        {
          test: require.resolve('three/examples/js/objects/Sky.js'),
          use: 'imports-loader?THREE=three'
        },
        {
          test: require.resolve('three/examples/js/objects/Sky.js'),
          use: 'exports-loader?THREE.Sky'
        }
      ]
    }
  }
}