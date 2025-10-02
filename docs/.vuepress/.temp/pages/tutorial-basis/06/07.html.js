import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/06/07.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/06/07.html\",\"title\":\"重点回顾\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1571563898000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":1,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"744799095f0579368259d9acdb10975764bd061c\",\"time\":1571563898000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"重点回顾\"}]},\"filePathRelative\":\"tutorial-basis/06/07.md\"}")
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
