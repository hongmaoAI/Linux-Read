import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/01/04.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/01/04.html\",\"title\":\"重点回顾\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1570001343000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":1,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"341a2cbfa6f44d8e3de18a92a7611d0d8adc4fbe\",\"time\":1570001343000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"重点回顾\"}]},\"filePathRelative\":\"tutorial-basis/01/04.md\"}")
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
