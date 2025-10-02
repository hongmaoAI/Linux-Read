import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/02/index.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/02/\",\"title\":\"主机规划与磁盘划分\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1570370646000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":3,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"b825425df9520f60187701b7c372993e6e41b555\",\"time\":1570370646000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"使用 index.md 会导致在 build 后部署的嵌套侧边栏不工作，无法点击打开嵌套的侧边栏\"},{\"hash\":\"9170e0416aea0075de2c2bdd085e5715cf090f31\",\"time\":1570106368000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"磁盘分区\"},{\"hash\":\"b1db776e05ed5746f812671bcae3c0e8fa0161e9\",\"time\":1570019940000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"linux 当前的应用角色\"}]},\"filePathRelative\":\"tutorial-basis/02/README.md\"}")
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
