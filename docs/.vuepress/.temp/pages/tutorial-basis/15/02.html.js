import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/15/02.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/15/02.html\",\"title\":\"仅执行一次的工作排程\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1583486275000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":2,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"d0dca73f75d1638da1c2e74c5c059df33e05258c\",\"time\":1583486275000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"at 用法\"},{\"hash\":\"1323c754cc9f764ee7f1fa07df2ca59a7657ebab\",\"time\":1583397614000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"crontab 开坑\"}]},\"filePathRelative\":\"tutorial-basis/15/02.md\"}")
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
