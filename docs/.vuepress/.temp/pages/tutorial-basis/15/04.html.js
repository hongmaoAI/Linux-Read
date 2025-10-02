import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/15/04.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/15/04.html\",\"title\":\"可唤醒停机期间的工作任务\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1583653503000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":2,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"0ff6fb3ad12c18919357d0357739087ca6daa6c8\",\"time\":1583653503000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"anacron 过期任务的处理\"},{\"hash\":\"1323c754cc9f764ee7f1fa07df2ca59a7657ebab\",\"time\":1583397614000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"crontab 开坑\"}]},\"filePathRelative\":\"tutorial-basis/15/04.md\"}")
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
