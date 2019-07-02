const VueLoaderPlugin = require('vue-loader/lib/plugin')
const util = require('./util')

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    app: './src/main.ts'
  },
  output: {
    path: util.resolve('dist'),
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[id].[chunkhash].js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'], // 引入 ts js vue json 文件时可以不用写后缀名
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js',
      '@': util.resolve('src') // 配置 @ 指向 src
    }
  },
  module: {
    rules: [
      ...util.eslint, // eslint 配置
      ...util.cssLoaders, // css loader 配置
      {
        // 对所有引入的tsx文件进行解析
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          // 自动将所有.vue文件转化为.vue.tsx文件
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'tslint-loader',
        include: util.resolve('src')
      },
      {
        test: /\.js$/,
        use: [
          'babel-loader?cacheDirectory'
        ],
        include: util.resolve('src')
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              cacheBusting: true,
              transformToRequire: {
                video: ['src', 'poster'],
                source: 'src',
                img: 'src',
                image: 'xlink:href'
              }
            }
          }
        ],
        include: util.resolve('src')
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: 'images/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: 'media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  stats: {
    children: false // 避免过多子信息
  }
}
