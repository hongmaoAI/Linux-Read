import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/15/06.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/15/06.html\",\"title\":\"本章习题\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1583654887000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":2,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"8fe46d03c70a2c8e7786eefb546dc6d3cac14b2f\",\"time\":1583654887000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"本章习题\"},{\"hash\":\"1323c754cc9f764ee7f1fa07df2ca59a7657ebab\",\"time\":1583397614000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"crontab 开坑\"}]},\"filePathRelative\":\"tutorial-basis/15/06.md\"}")
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
