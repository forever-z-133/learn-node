# NodeJS 小仓库

自己用 node.js 玩点小玩意，纯属娱乐，不便演示还是看源码吧。

_下载使用 chrome 插件 Octotree，可在网页左侧将显示项目的目录，非常方便查看源码。_

```bash
# 安装
npm i -g zyh-node-2

# 验证安装成功，会看到红色文字
foreverZ color
```

## 有用工具

- 一键预览 css 文件中的字体图标 `foreverZ font` [源码](https://github.com/forever-z-133/learn-node/blob/master/test/previewFont/entry.mjs)
- 递归删除文件夹中比如 `.bak` `.DS_Store` 之类的文件 `foreverZ rm` [源码](https://github.com/forever-z-133/learn-node/blob/master/test/removeSomething/entry.mjs)
- 递归删除空文件夹 `foreverZ rmDir` [源码](https://github.com/forever-z-133/learn-node/blob/master/test/removeEmptyDir/entry.mjs)

## 老色批工具

- 将番号按 ABC-123.mp4 的格式进行重命名 `foreverZ rename` [源码](https://github.com/forever-z-133/learn-node/blob/master/mine/rename/entry.mjs)
- 检查我本地是否已下载该番号 `foreverZ exist` [源码](https://github.com/forever-z-133/learn-node/blob/master/mine/findExist/entry.mjs)
- 将不好看的删除，并留个 txt 番号备份 `foreverZ remove` [源码](https://github.com/forever-z-133/learn-node/blob/master/mine/findNotGood/index.js)
- 读取番号合集文件，找出还未下载的番号链接 `foreverZ find` [源码](https://github.com/forever-z-133/learn-node/blob/master/mine/findNotDownload/index.js)
- 检查番号文件的命名是否都已格式化 `foreverZ check` [源码](https://github.com/forever-z-133/learn-node/blob/master/mine/check/index.mjs)

## 试验工具

- 使打印的文本带有颜色 `foreverZ color` [源码](https://github.com/forever-z-133/learn-node/blob/master/test/consoleColor/index.js)
- 试验几种系统弹窗 `foreverZ alert` [源码](https://github.com/forever-z-133/learn-node/blob/master/test/alert/entry.mjs)
- 快速剪辑合并视频 `foreverZ concat` [源码](https://github.com/forever-z-133/learn-node/blob/master/test/concatVideo/entry.mjs)
- 给微信发通知 `foreverZ notify` [源码](https://github.com/forever-z-133/learn-node/blob/master/test/sendNotify/index.mjs)
- 下载油管视频 `foreverZ youtube` [源码](https://github.com/forever-z-133/learn-node/blob/master/test/youtube/index.mjs)
- 爬虫 w3cplus 网站 `foreverZ w3c` [源码](https://github.com/forever-z-133/learn-node/blob/master/test/w3cplus/index.js)
