import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/04/03.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/04/03.html\",\"title\":\"超简单文字编辑器 nano\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1570373092000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":1,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"8bc0ba3cf6f8ec7dabcbe9509da9d07a5694ecfc\",\"time\":1570373092000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"超简单文字编辑器 nano\"}]},\"filePathRelative\":\"tutorial-basis/04/03.md\"}")
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
