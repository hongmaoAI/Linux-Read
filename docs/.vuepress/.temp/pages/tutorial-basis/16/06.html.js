import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/16/06.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/16/06.html\",\"title\":\"重点回顾\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1584499002000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":2,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"d888e08b1866a210632c7e2a9c63947df4909554\",\"time\":1584499002000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"重点回顾与练习题\"},{\"hash\":\"e6e3b9427484fbaac5ff15651bd0bb3213499a79\",\"time\":1583655387000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"进程管理与 SELinux 初探 开坑\"}]},\"filePathRelative\":\"tutorial-basis/16/06.md\"}")
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
