import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { viteBundler } from '@vuepress/bundler-vite'
import tutorialBasisSC from '../tutorial-basis'

export default defineUserConfig({
  base: '/linux-tutorial/',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'Linux 系统教程（笔记）',
      description: 'linux 系统教程学习笔记'
    }
  },
  theme: defaultTheme({
    logo: '/mlogo.svg',
    repo: 'https://github.com/zq99299/linux-tutorial',
    docsDir: 'docs',
    docsBranch: 'master',
    editLink: true,
    editLinkText: '帮助我们改善此页面！',
    lastUpdated: true,
    lastUpdatedText: '上次更新: ',
    contributors: false,
    smoothScroll: true,
    sidebarDepth: 3,
    navbar: [
      { text: 'Home', link: '/' },
      { text: '鸟哥私房菜-基础篇', link: '/tutorial-basis/' },
      { text: '参与讨论', link: '/discuss.md' },
      {
        text: '笔记精选汇总',
        children: [
          { text: 'GitHub 站', link: 'https://github.com/zq99299/repository-summary' },
          { text: '国内镜像站', link: 'http://book.mrcode.cn/' }
        ]
      }
    ],
    sidebar: {
      '/tutorial-basis/': tutorialBasisSC()
    }
  }),
  bundler: viteBundler()
})