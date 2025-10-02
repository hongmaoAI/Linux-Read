import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/09/05.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/09/05.html\",\"title\":\"重点回顾\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1572966702000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":2,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"da31d3db6b4a51ff79cfb395ab9b50e93664e4cc\",\"time\":1572966702000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"重点回顾\"},{\"hash\":\"720367f48331f1b9b53bc173379312cdbacdcb28\",\"time\":1572756091000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"vim 程序编辑器开坑\"}]},\"filePathRelative\":\"tutorial-basis/09/05.md\"}")
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
