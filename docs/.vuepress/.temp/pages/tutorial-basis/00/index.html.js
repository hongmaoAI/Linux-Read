import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/00/index.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/00/\",\"title\":\"00. 计算机概论\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1570370646000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":3,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"b825425df9520f60187701b7c372993e6e41b555\",\"time\":1570370646000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"使用 index.md 会导致在 build 后部署的嵌套侧边栏不工作，无法点击打开嵌套的侧边栏\"},{\"hash\":\"431cd09233ba037e8e155a8eb1a65c2f581245a7\",\"time\":1569678684000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"00. 计算机概论\"},{\"hash\":\"9e32a7339d340742dbc3ca9283945cc99b8e6d3d\",\"time\":1569033485000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"init\"}]},\"filePathRelative\":\"tutorial-basis/00/README.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
