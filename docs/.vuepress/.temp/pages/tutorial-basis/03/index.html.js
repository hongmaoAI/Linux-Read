import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/03/index.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/03/\",\"title\":\"安装 CentOS 7.x\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1570370646000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":2,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"b825425df9520f60187701b7c372993e6e41b555\",\"time\":1570370646000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"使用 index.md 会导致在 build 后部署的嵌套侧边栏不工作，无法点击打开嵌套的侧边栏\"},{\"hash\":\"103eb944a6dbb2c525c8fda026fc6c3678cad932\",\"time\":1570156783000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"练习机的规划，重点是分区参数\"}]},\"filePathRelative\":\"tutorial-basis/03/README.md\"}")
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
