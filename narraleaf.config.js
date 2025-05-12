const {BuildTarget, WindowsBuildTarget} = require("narraleaf");

/**@type {import("narraleaf").ProjectConfig} */
module.exports = {
  renderer: {
    baseDir: "./renderer"
  },
  main: "./main/index.ts",
  build: {
    productName: "NarraLeaf Demo",
    appId: "com.narraleaf",
    targets: [
      BuildTarget.Windows({
        target: WindowsBuildTarget.dir,
        icon: "main/assets/app-icon.ico",
      })
    ]
  },
  resources: "main/assets"
};
