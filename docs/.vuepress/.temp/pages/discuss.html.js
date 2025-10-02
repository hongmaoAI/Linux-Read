import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/discuss.html.vue"
const data = JSON.parse("{\"path\":\"/discuss.html\",\"title\":\"讨论区\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1689478408000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":3,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"7ce740c1469ec230a5d6da1ae8174d95cad0da76\",\"time\":1689478408000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"修复丢失的额自动打包发布脚本\"},{\"hash\":\"19fb82baccdb1bd9858954ac65bf35e5e77381b2\",\"time\":1578926440000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"讨论页\"},{\"hash\":\"49d5cf513481eaf022bc136ca686c6feaa9ea685\",\"time\":1578563553000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"增加评论、与 code copy\"}]},\"filePathRelative\":\"discuss.md\"}")
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
