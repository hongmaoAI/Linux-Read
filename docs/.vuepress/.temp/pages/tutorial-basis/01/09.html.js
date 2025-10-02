import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/01/09.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/01/09.html\",\"title\":\"重点回顾\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1570073105000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":3,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"2d3cef7f44d288907b7e433a2e099414df111086\",\"time\":1570073105000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"第四版调整\"},{\"hash\":\"3932441a59864216fd4732bea2b38b111dbdefa7\",\"time\":1570029210000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"重点回顾\"},{\"hash\":\"223686786d037f4f598f6224f4fd6f2b7d0b687e\",\"time\":1570020122000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"目录预备\"}]},\"filePathRelative\":\"tutorial-basis/01/09.md\"}")
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
