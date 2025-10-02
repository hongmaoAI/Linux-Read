<p align="center">
  <a href="https://github.com/zq99299/repository-summary" target="_blank">
     <img width="200" src="./docs/.vuepress/public/mlogo.svg" alt="logo">
  </a>
  <br/>
  <br/>
  <a href="https://github.com/zq99299/repository-summary" target="_blank"> 
    所有笔记 → 系列导航
  </a>
</p>



## 项目技术栈

本项目已升级到 VuePress v2 + Vite + Vue 3 架构，提供更快的启动速度和热更新体验。

## 运行方式

### 开发环境

- 快速启动（推荐）：
  ```bash
  npm run dev
  ```

- 清理缓存后启动：
  ```bash
  npm run docs:dev-fast
  ```

- 传统方式启动：
  ```bash
  npm run docs:dev
  ```

### 生产构建

- 打包发布：
  ```bash
  npm run docs:build
  ```

### 其他命令

- 大内存启动（适用于内容较多的情况）：
  ```bash
  npm run docs:devx
  ```

- 大内存构建：
  ```bash
  npm run docs:buildx
  ```