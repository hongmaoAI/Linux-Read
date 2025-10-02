import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/04/05.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/04/05.html\",\"title\":\"重点回顾\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1570377375000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":1,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"f226bb7d4333dee2bf3173f52696eab2f43c4d10\",\"time\":1570377375000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"正确的关机方法和总结\"}]},\"filePathRelative\":\"tutorial-basis/04/05.md\"}")
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
