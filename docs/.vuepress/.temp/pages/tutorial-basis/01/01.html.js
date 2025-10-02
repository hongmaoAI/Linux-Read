import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/01/01.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/01/01.html\",\"title\":\"Linux 是什么？\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1660633903000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":1,\"url\":\"https://github.com/zq99299\"},{\"name\":\"Scott\",\"username\":\"Scott\",\"email\":\"m@imemm.com\",\"commits\":1,\"url\":\"https://github.com/Scott\"}],\"changelog\":[{\"hash\":\"db82c33e4cb4025b9a863b68468273f5cc68363b\",\"time\":1660633903000,\"email\":\"m@imemm.com\",\"author\":\"Scott\",\"message\":\"Update 01.md\"},{\"hash\":\"a2f346078557f5d653cec6371b718f73269b85c3\",\"time\":1569854721000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"linux 是什么\"}]},\"filePathRelative\":\"tutorial-basis/01/01.md\"}")
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
