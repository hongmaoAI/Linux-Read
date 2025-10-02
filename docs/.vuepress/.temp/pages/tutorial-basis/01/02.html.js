import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/01/02.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/01/02.html\",\"title\":\"Torvalds 的 Linux 开发\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1570000243000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":2,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"70ca99884fee705160dc97ed0ec6986efdb956e7\",\"time\":1570000243000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"linux 的特色\"},{\"hash\":\"b4e847563cb3f8fb7423eb1989b960c3de048525\",\"time\":1569860169000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"Torvalds 的 Linux 开发\"}]},\"filePathRelative\":\"tutorial-basis/01/02.md\"}")
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
