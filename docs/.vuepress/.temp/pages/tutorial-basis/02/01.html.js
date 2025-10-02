import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/02/01.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/02/01.html\",\"title\":\"Linux 与 硬件的搭配\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1570106368000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":3,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"9170e0416aea0075de2c2bdd085e5715cf090f31\",\"time\":1570106368000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"磁盘分区\"},{\"hash\":\"2d3cef7f44d288907b7e433a2e099414df111086\",\"time\":1570073105000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"第四版调整\"},{\"hash\":\"b1db776e05ed5746f812671bcae3c0e8fa0161e9\",\"time\":1570019940000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"linux 当前的应用角色\"}]},\"filePathRelative\":\"tutorial-basis/02/01.md\"}")
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
