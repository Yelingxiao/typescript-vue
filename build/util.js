const os = require('os')
const path = require('path')
// 引入抽取 css 的 loader
const CssExtractLoader = require('mini-css-extract-plugin').loader
const eslintFriendlyFormatter = require('eslint-friendly-formatter')

// 路径处理函数
const resolve = dir => path.resolve(__dirname, '../', dir)

// 环境判断
const IS_PROD = process.env.NODE_ENV === 'production'

// eslint 配置
const getEslintRules = () => {
  let eslint = []
  if (!IS_PROD) {
    eslint = [
      {
        test: /\.(js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: resolve('src'),
        options: {
          formatter: eslintFriendlyFormatter, // eslint 友好提示
          emitWarning: true
        }
      }
    ]
  }
  return eslint
}

// 获取本机ip地址
const getIPAdress = () => {
  var interfaces = os.networkInterfaces()
  for (var devName in interfaces) {
    var iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i]
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address
      }
    }
  }
}

// css loader 配置
const cssLoaders = () => {
  const generateCssLoaders = loaderName => {
    const baseLoader = IS_PROD
      ? ['css-loader', 'postcss-loader'] // 生产环境使用 postcss-loader 进行后处理
      : ['css-loader']
    // 如果有名称则创建一个该名称的 loader 来解析，例如 scss、less、stylus
    if (loaderName) {
      baseLoader.push(`${loaderName}-loader`)
    }
    // 如果是生产环境就引入提取 css 的 loader
    if (IS_PROD) {
      baseLoader.unshift(CssExtractLoader)
    }
    // style-loader 在最前，插入到 html 里
    return ['style-loader', ...baseLoader]
  }
  const loaderObj = {
    css: generateCssLoaders(), // 开发环境生成 ['style-loader', 'css-loader']
    'styl(us)?': generateCssLoaders('stylus'), // 开发环境生成 ['style-loader', 'css-loader', 'stylus-loader']
    'less?': generateCssLoaders('less') // 开发环境生成 ['style-loader', 'css-loader', 'less-loader']
  }
  const loaders = []
  // 生成带 test 的完整 rule
  for (const name in loaderObj) {
    loaders.push({
      test: new RegExp(`\\.${name}$`),
      use: loaderObj[name]
    })
  }
  return loaders
}

module.exports = {
  IS_PROD,
  resolve,
  getIPAdress: getIPAdress(),
  eslint: getEslintRules(),
  cssLoaders: cssLoaders()
}
