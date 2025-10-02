import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/09/06.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/09/06.html\",\"title\":\"本章练习\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1573310488000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":3,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"ffa183e2beedc4169afcbc1ef070a90185b7441f\",\"time\":1573310488000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"update\"},{\"hash\":\"1ef160de755ba46259049611763ebeb7ca15ee0a\",\"time\":1573310134000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"练习题\"},{\"hash\":\"720367f48331f1b9b53bc173379312cdbacdcb28\",\"time\":1572756091000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"vim 程序编辑器开坑\"}]},\"filePathRelative\":\"tutorial-basis/09/06.md\"}")
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
