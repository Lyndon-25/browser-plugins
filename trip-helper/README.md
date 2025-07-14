# Trip Helper

Trip Helper 是一个浏览器扩展程序，用于增强 Trip.com 和 Ctrip.com 网站的用户体验。

## 功能

### URL 参数重排序

当访问 Trip.com 或 Ctrip.com 的详情页面时，插件会自动重新排序 URL 参数，使重要参数（如 locale、入住日期、退房日期等）排在前面，提高 URL 的可读性。

优先排序的参数包括：

- locale
- h-id
- c-in
- c-out
- c-rooms
- d-city
- d-type
- source-tag
- d-time
- hotelId
- checkIn
- checkOut
- adult
- children

## 安装说明

1. 下载或克隆此仓库到本地
2. 打开 Chrome 浏览器，进入扩展程序页面 (chrome://extensions/)
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择此项目的目录

## 使用方法

安装后无需额外配置，插件会自动在符合条件的页面上运行。当你访问 Trip.com 或 Ctrip.com 的详情页面时，URL 参数会自动重新排序。

## 后续功能

更多功能正在开发中，敬请期待！
