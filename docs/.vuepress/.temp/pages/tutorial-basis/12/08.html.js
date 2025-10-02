import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/12/08.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/12/08.html\",\"title\":\"本章练习\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1581584723000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":2,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"cf55e0d8a4cacffd178e66860231be74d7203a2f\",\"time\":1581584723000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"本章练习\"},{\"hash\":\"2795c5b2502777bbcc257344f1cfe8b9b9080ff0\",\"time\":1579400117000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"学习 shell scripts 开坑\"}]},\"filePathRelative\":\"tutorial-basis/12/08.md\"}")
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
