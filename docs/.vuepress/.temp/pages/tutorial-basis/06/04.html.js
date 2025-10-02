import comp from "E:/linux命令学习/linux-tutorial/docs/.vuepress/.temp/pages/tutorial-basis/06/04.html.vue"
const data = JSON.parse("{\"path\":\"/tutorial-basis/06/04.html\",\"title\":\"文件与目录的默认权限与隐藏权限\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1571236521000,\"contributors\":[{\"name\":\"zq99299\",\"username\":\"zq99299\",\"email\":\"99299684@qq.com\",\"commits\":3,\"url\":\"https://github.com/zq99299\"}],\"changelog\":[{\"hash\":\"fba39ce019137a34f94545136f66232042951a50\",\"time\":1571236521000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"SUID、SGID、SBIT 权限设定 file 指令观察文件类型\"},{\"hash\":\"87d384bb3a42618f6a26d6d9fe1666a2057297ae\",\"time\":1571067160000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"文件因此属性，chattr lsattr\"},{\"hash\":\"b3cd80138c2ca0993fd49cf80c4d04bc3731b3c9\",\"time\":1571065909000,\"email\":\"99299684@qq.com\",\"author\":\"zq99299\",\"message\":\"文件预设权限 umask\"}]},\"filePathRelative\":\"tutorial-basis/06/04.md\"}")
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
