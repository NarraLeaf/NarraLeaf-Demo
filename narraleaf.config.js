const {BuildTarget, WindowsBuildTarget} = require("narraleaf");

module.exports = {
  renderer: {
    baseDir: "./renderer"
  },
  main: "./main/index.ts",
  build: {
    appId: "com.example.app",
    targets: [
      BuildTarget.Windows({
        target: WindowsBuildTarget.dir,
        icon: "main/assets/app-icon.ico",
      })
    ]
  },
  resources: "main/assets"
};
