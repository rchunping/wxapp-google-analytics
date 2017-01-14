## GoogleAnalytics

----

### `GoogleAnalytics.getInstance(app)`

获取`GoogleAnalytics`实例，在`app`上始终得到同一个实例。


| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `app` | Object | empty Object | 建议使用App对象 |

> **返回** `GoogleAnalytics` 实例

### 实例方法

### `setAppName(appName)`

设置小程序名称

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `appName` | String | "Mini Program" | 小程序名称 |

> **返回** `GoogleAnalytics`

### `setAppVersion(appVersion)`

设置小程序版本

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `appVersion` | String | "unknow" | 小程序版本号 |

> **返回** `GoogleAnalytics`

### `newTracker(trackingID)`

创建一个`Tracker`实例

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `trackingID` | String | 无 | Google Analytics的媒体资源跟踪ID，一般是`UA-XXXX-X`的形式。 |

> **返回** `Tracker`实例


## 示例

```js
var ga = require('path/to/ga.js');
var GoogleAnalytics = ga.GoogleAnalytics;
// ...
var app = getApp(); //获取微信小程序的App实例

// 初始化GoogleAnalytics
var gaInstance = GoogleAnalytics.getInstance(app);
gaInstance.setAppName('小程序名称'); // 设置APP名称
gaInstance.setAppVersion('小程序版本号'); //设置APP版本号，[可选]

// 创建一个跟踪器 Tracker
var tracker = gaInstance.newTracker('UA-XXXXXX-X'); 
```

建议在 `app.js` 中全局共享一个跟踪器:

```js
// app.js
var ga = require('path/to/ga.js');
var GoogleAnalytics = ga.GoogleAnalytics;
App({
    // ...
    tracker: null,
    getTracker: function () {
        if (!this.tracker) {
            // 初始化GoogleAnalytics Tracker
            this.tracker = GoogleAnalytics.getInstance(this)
                            .setAppName('小程序名称')
                            .setAppVersion('小程序版本号')
                            .newTracker('UA-XXXXXX-X'); 
        }
        return this.tracker;
    },
    // ...
})
```

```js
// 用的时候直接从`App`实例获取共享的`Tracker`
var t = getApp().getTracker();
```