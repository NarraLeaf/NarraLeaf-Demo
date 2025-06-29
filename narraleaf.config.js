const {BuildTarget, WindowsBuildTarget} = require("narraleaf");

/**@type {import("narraleaf").ProjectConfig} */
module.exports = {
  build: {
    appId: "com.example.narraleaf-demo",
    copyright: "Copyright © 2025",
    dev: true,
    dist: "dist",
    productName: "NarraLeaf Demo",
    targets: [
      BuildTarget.Windows({
        target: WindowsBuildTarget.dir,
        icon: "main/assets/app-icon.ico",
      })
    ],
  },
  main: "main/index.ts",
  renderer: {
    baseDir: "renderer",
    allowHTTP: true,
    httpDevServer: true,
  },
  temp: ".narraleaf",
  dev: {
    port: 5050,
  },
  resources: "main/assets",
};
