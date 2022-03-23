# react-reader

## 项目介绍

这是一个基于React+TypeScript开发的小说阅读器WebApp。

## 后端接口

本项目使用了追书神器和笔趣阁的API。

[追书神器API文档](https://github.com/shichunlei/-Api/blob/master/%E8%BF%BD%E4%B9%A6%E7%A5%9E%E5%99%A8.md)

[笔趣阁API文档](https://blog.csdn.net/weixin_46291378/article/details/112320747)

项目中在榜单、分类、搜索及书籍详细信息中使用追书神器的API，但由于追书神器现在已经获取不到小说内容，因此在这一部分使用了笔趣阁API。由于两者的Book_id不同，在某些功能的实现上会显得有些冗杂。

## 技术栈

本项目使用 react + typescript + react-router-dom + axios 实现。

- antd：react组件库。
- http-proxy-middleware：前端配置代理中间件。
- better-scroll：移动端滚动插件。
- pubsub-js：发布/订阅库。
- react-router-dom：react-router-dom v6，相较于之前用过的版本变化挺多的。
- less：css开发工具。
- eslint：使得代码风格统一。
- gh-pages：发布GitHub Pages（配置但未使用）。

## 主要功能

+ 书架 - localStorage存储书架信息
  
  + 长按编辑
  
  + 列表/图墙模式切换

+ 榜单

+ 分类

+ 小说详情界面

+ 阅读界面
  
  + 查看阅读进度
  
  + 日间/夜间模式
  
  + 修改字体、行距及主题

+ 搜索发现

## 安装及运行

```
git clone https://github.com/doublewhitee/react-reader.git

// 进入前端项目目录
cd react-reader

// 安装依赖
yarn

// 启动开发服务器
yarn start

// 编译前端代码
yarn build
```

## 项目截图

**书架**

<img src="https://github.com/doublewhitee/react-reader/blob/main/screenshot/bookshelf_1.png?raw=true" title="" alt="img" height="400">     <img src="https://github.com/doublewhitee/react-reader/blob/main/screenshot/bookshelf_2.png?raw=true" title="" alt="img" height="400">

**阅读**

<img title="" src="https://github.com/doublewhitee/react-reader/blob/main/screenshot/read_1.png?raw=true" alt="img" height="400">     <img title="" src="https://github.com/doublewhitee/react-reader/blob/main/screenshot/read_2.png?raw=true" alt="img" height="400">
<img title="" src="https://github.com/doublewhitee/react-reader/blob/main/screenshot/read_3.png?raw=true" alt="img" height="400">     <img title="" src="https://github.com/doublewhitee/react-reader/blob/main/screenshot/read_4.png?raw=true" alt="img" height="400">

**其他**

<img title="" src="https://github.com/doublewhitee/react-reader/blob/main/screenshot/recommend.png?raw=true" alt="img" height="400">     <img title="" src="https://github.com/doublewhitee/react-reader/blob/main/screenshot/sort.png?raw=true" alt="img" height="400">     <img title="" src="https://github.com/doublewhitee/react-reader/blob/main/screenshot/search.png?raw=true" alt="img" height="400">