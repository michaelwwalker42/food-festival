const path = require("path");
// bring webpack's methods and properties into the config file
const webpack = require("webpack");
// a plugin that will analyze our bundle sizes to see how much JavaScript is being processed by the browser.
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const WebpackPwaManifest = require("webpack-pwa-manifest");

module.exports = {
  entry: {
    app: "./assets/js/script.js",
    events: "./assets/js/events.js",
    schedule: "./assets/js/schedule.js",
    tickets: "./assets/js/tickets.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: __dirname + "/dist",
  },
  module: {
    rules: [
      // This object will identify the type of files to pre-process using the test property to find a regular expression, or regex. In our case, we are trying to process any image file with the file extension of .jpg. We could expand this expression to also search for other image file extensions such as .png, .svg, or .gif.
      {
        test: /\.jpg$/i,
        use: [
          {
            // The default behavior of file-loader is such that file will be treated as an ES5 module. As a result, paths to images might be formatted incorrectly. To prevent this we can add a key-value pair in our options object: esModule: false
            // As you can see, we added an options object below the loader assignment that contains a name function, which returns the name of the file with the file extension. Below that is the publicPath property, which is also a function that changes our assignment URL by replacing the ../ from our require() statement with /assets/.
            loader: "file-loader",
            options: {
              esModule: false,
              name(file) {
                return "[path][name].[ext]"
              },
              publicPath: function (url) {
                return url.replace("../", "/assets/")
              }
            }
          },
          {
            loader: 'image-webpack-loader'
          }
        ]
      }
    ]
  },
  // We're going to use the providePlugin plugin to define the $ and jQuery variables to use the installed npm package. If we did not do this, the code would still not work even though we installed jQuery. Whenever you work with libraries that are dependent on the use of a global variable, just like jQuery is with $ and jQuery, you must tell webpack to make exceptions for these variables by using webpack.ProvidePlugin
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    // Notice that when we added the BundleAnalyzerPlugin, we configured the analyzerMode property with a static value. This will output an HTML file called report.html that will generate in the dist folder. We can also set this value to disable to temporarily stop the reporting and automatic opening of this report in the browser.
    new BundleAnalyzerPlugin({
      analyzerMode: "static", // the report outputs to an HTML file in the dist folder
    }),
    new WebpackPwaManifest({
      name: "Food Event",
      short_name: "Foodies",
      description: "An app that allows you to view upcoming food events.",
      start_url: "../index.html",
      background_color: "#01579b",
      theme_color: "#ffffff",
      fingerprints: false,
      inject: false,
      icons: [{
        src: path.resolve("assets/img/icons/icon-512x512.png"),
        sizes: [96, 128, 192, 256, 384, 512],
        destination: path.join("assets", "icons")
      }]
    })
  ],
  // By default, webpack wants to run in production mode. 
  // In this mode, webpack will minify our code for us automatically.
  // We want our code to run in development mode
  mode: 'development'
};