import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/04/index.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/04/\",\"title\":\"首次登陆与线上求助\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1570370646000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":2,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"b825425df9520f60187701b7c372993e6e41b555\",\"time\":1570370646000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"使用 index.md 会导致在 build 后部署的嵌套侧边栏不工作，无法点击打开嵌套的侧边栏\"},{\"hash\":\"cd436fcb8876cd246c927e1b7e7627cde700c315\",\"time\":1570204680000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"文本模式下指令的下达\"}]},\"filePathRelative\":\"tutorial-basis/04/README.md\"}")
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
