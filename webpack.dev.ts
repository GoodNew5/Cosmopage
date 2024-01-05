import { merge } from 'webpack-merge'
import webpack from 'webpack'
import path from 'path'
import common from './webpack.common'

const config = merge(common, {
  context: path.resolve(__dirname, './src'),
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    hot: false,
    host: '0.0.0.0',
    compress: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
})

export default config
