import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/10/08.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/10/08.html\",\"title\":\"本章习题\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1575810152000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":2,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"f92214407b6b6c48a2e557ee7453f7434b112cf8\",\"time\":1575810152000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"练习\"},{\"hash\":\"4c373d111ead8940428d0cc0b17f1bd72242bfe2\",\"time\":1573310419000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"认识与学习 BASH\"}]},\"filePathRelative\":\"tutorial-basis/10/08.md\"}")
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
