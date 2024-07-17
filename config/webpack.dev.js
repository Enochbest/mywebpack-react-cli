const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const path = require("path");

const getStyleLoader = ()=>{
    return [
        //loader的执行顺序是从右到左,从下到上
        'style-loader',//将js中css通过创建style标签的方式添加到html文件中并且生效
        'css-loader',//将css资源编译成commonjs模块到js中
        {
            //处理css 兼容性问题
            //配合package.json中的browserList来指定兼容性
            loader: "postcss-loader",
            options: {
                postcssOptions:{
                    plugins:["postcss-preset-env"]
                }
            }
        },
    ]
}

module.exports = {
    entry: "./src/main.js",
    output: {
        path: undefined,
        filename: "static/js/[name].js",
        chunkFilename: "static/js/[name].chunk.js",
        assetModuleFilename: "static/media/[hash:10][ext][query]"
    },
    module: {
        rules: [
            //处理css
            {
                test: /\.css$/,//只监测.css文件
                use: getStyleLoader(),
            },
            {
                test: /\.less$/,//只监测.css文件
                use: [
                    ...getStyleLoader(),
                    'less-loader'
                ],
            },
            {
                test: /\.s[ac]ss$/,//只监测.css文件
                use: [
                    ...getStyleLoader(),
                    'sass-loader'
                ],
            },
            {
                test: /\.styl$/,//只监测.css文件
                use: [
                    ...getStyleLoader(),
                    'stylus-loader'
                ],
            },
            //处理图片
            {
                test: /\.(png|jpe?g|gif|webp|svg)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        //小于10kb转base64 减少资源请求数量 ,减轻服务器压力,图片体积大了 一点点
                        maxSize: 10 * 1024 // 4kb
                    }
                },
            },
            //打包字体文件目录
            {
                test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
                type: 'asset/resource',
            },
            //处理js
            {
                test: /\.(jsx|js)$/,
                include: path.resolve(__dirname, "../src"),
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                    cacheCompression: false,
                    plugins: [
                        // "@babel/plugin-transform-runtime", // presets中包含了
                        "react-refresh/babel",
                    ],
                },
            },
        ]
    },
    plugins: [
        new ESLintWebpackPlugin({
            // 指定检查文件的根目录
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules",
            cache: true,
            cacheLocation: path.resolve(
                __dirname,
                "../node_modules/.cache/.eslintcache"
            ),
        }),
        //处理html
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        new ReactRefreshWebpackPlugin(), // 解决js的HMR功能运行时全局变量的问题
    ],
    optimization: {
        splitChunks: {
            chunks: "all",
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`,
        },
    },
    resolve: {
        extensions: [".jsx", ".js", ".json"], // 自动补全文件扩展名，让jsx可以使用
    },
    devServer: {
        open: true,
        host: "localhost",
        port: 3000,
        hot: true,
        compress: true,
        historyApiFallback: true, // 解决react-router刷新404问题
    },
    mode: "development",
    devtool: "cheap-module-source-map",
}