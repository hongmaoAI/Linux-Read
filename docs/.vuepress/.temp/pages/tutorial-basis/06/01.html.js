import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/06/01.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/06/01.html\",\"title\":\"目录与路径\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1570893058000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":1,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"93cb8b6911a04641a8ab3e2815c93711f20dd0b7\",\"time\":1570893058000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"目录与路径\"}]},\"filePathRelative\":\"tutorial-basis/06/01.md\"}")
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
