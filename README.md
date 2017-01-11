
# 谷歌统计 (Google Analytics) 微信小程序版

## 快速入门

#### 1. Google Analytics 设置

在账号下新建媒体资源，跟踪内容选 `移动应用` ,得到 `跟踪ID (Tracker ID)`

#### 2. 在你的微信小程序项目添加 `ga.js` 文件

#### 3. 在微信小程序后台设置request合法域名

把 `www.google-analytics.com` 添加到request合法域名中。对，就是每个月只能设置3次那个。

#### 4. 框架 `app.js` 中修改

```js
var ga = require('path/to/ga.js');
var GoogleAnalytics = ga.GoogleAnalytics;
App({
    // ...
    tracker: null,
    getTracker: function () {
        if (!this.tracker) {
            // 初始化GoogleAnalytics Tracker
            this.tracker = GoogleAnalytics.getInstance(this)
                            .setAppName('`小程序名称`')
                            .setAppVersion('`小程序版本号`')
                            .newTracker('`Tracker ID`'); //一般是 UA-XXXX-X
        }
        return this.tracker;
    },
    // ...
})
```

#### 5. 找个Page来尝试一下简单的ScreenView统计

```js
var ga = require('path/to/ga.js');
var HitBuilders = ga.HitBuilders;
Page({
    // ...

    // 一般在onShow()里处理ScreenView
    onShow: function(){
        // 获取那个Tracker实例
        var t = getApp().getTracker();
        t.setScreenName('这是我的首屏页');
        t.send(new HitBuilders.ScreenViewBuilder().build());
    },
    // ...
})
```

#### 6. 去谷歌统计后台看一下 实时 > 概览

一切正常的话，几秒钟后就能看到数据了。


## 文档

（待整理，稍后补上）  
接口设计跟Android的SDK提供的很类似，有经验的看代码应该马上能用。

## 功能特点

* 支持多个匹配数据批量上报
* 因为微信小程序只支持5个`wx.request`并发，为了不影响业务数据的网络请求，数据上报的时候按顺序进行，最多占用一个`wx.request`

## 可能的问题

如果控制台出现`"ga:failed"`,内容为`errMsg:"request:fail 小程序要求的 TLS 版本必须大于等于 1.2"`  
在翻墙的时候碰到了这个问题，不翻墙时正常。


其他问题可以通过控制台找 "ga.****" 的那些信息查看。

## TODO

目前只实现了**ScreenView**, **Event**, **Exception** 和 **Timing**  
打算抽空实现 **增强型电子商务** 跟踪。

## 参考资料

协议 [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference)  
接口参照 [Google Analytics for Android](https://developers.google.com/analytics/devguides/collection/android/v4/)

