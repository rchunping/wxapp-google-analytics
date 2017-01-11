// 
// https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
// TODO: 目前只支持screenview,event,timing,exception, 需要支持更多统计类型
//

function GoogleAnalytics(app) {
    this.app = app; //小程序App实例
    this.systemInfo = wx.getSystemInfoSync();
    this.trackers = []; //可以有多个跟踪器，第一个为默认跟踪器
    this.appName = "Mini Program";
    this.appVersion = "unknow";

    //console.log(this.systemInfo);

    var cidKey = '_ga_cid'; // 存用户身份(UUID)

    var cid = wx.getStorageSync(cidKey) || false;
    if (!cid) {
        cid = getUUID();
        wx.setStorageSync(cidKey, cid);
    }
    this.cid = cid;
    this.userAgent = buildUserAgentFromSystemInfo(this.systemInfo);
    var pixelRatio = this.systemInfo.pixelRatio;
    this.sr = [this.systemInfo.windowWidth, this.systemInfo.windowHeight].map(function(x) { return Math.floor(x * pixelRatio) }).join('x');
    this.vp = [this.systemInfo.windowWidth, this.systemInfo.windowHeight].map(function(x) { return Math.floor(x) }).join('x');

    this.sending = false; //数据发送状态
    this.send_queue = []; //发送队列
}
GoogleAnalytics.prototype.setAppName = function(appName) {
    this.appName = appName;
    return this;
}
GoogleAnalytics.prototype.setAppVersion = function(appVersion) {
    this.appVersion = appVersion;
    return this;
}

// 小程序最多只有5个并发网络请求，使用队列方式尽量不过多占用请求
GoogleAnalytics.prototype.send = function(t, hit) {
    var ga = this;

    // 构造请求数据
    var data = {
        v: 1,
        tid: t.tid,
        cid: ga.cid,
        ds: "app",
        ul: ga.systemInfo.language,
        de: "UTF-8",
        sd: "24-bit",
        je: 0,
        t: hit.t,
        cd: t.screenName,
        an: ga.appName,
        av: ga.appVersion,
        sr: ga.sr,
        vp: ga.vp,
        ua: ga.userAgent
    };

    if (hit.t == "screenview") {
        if (hit.cd_arr.length > 0) {
            var i;
            for (i = 0; i < hit.cd_arr.length; i++) {
                var cd = hit.cd_arr[i];
                data["cd" + cd[0]] = cd[1];
            }
        }
        if (hit.cm_arr.length > 0) {
            var i;
            for (i = 0; i < hit.cm_arr.length; i++) {
                var cm = hit.cm_arr[i];
                data["cm" + cm[0]] = cm[1];
            }
        }
    } else if (hit.t == "event") {
        data.ec = hit.ec;
        data.ea = hit.ea;
        if (hit.el) { data.el = hit.el; }
        if (hit.ev) { data.ev = hit.ev; }
        if (hit.ni) { data.ni = 1; }
    } else if (hit.t == "social") {
        data.sn = hit.sn;
        data.sa = hit.sa;
        if (hit.st) { data.st = hit.st; }
    } else if (hit.t == "exception") {
        data.exd = hit.exd;
        data.exf = hit.exf;
    } else if (hit.t == "timing") {
        data.utc = hit.utc;
        data.utv = hit.utv;
        data.utt = hit.utt;
        if (hit.utl) { data.utl = hit.utl; }
    }

    console.log(["ga.queue.push", data]);

    this.send_queue.push([data, new Date()]);

    this._do_send();
}
GoogleAnalytics.prototype._do_send = function() {
    if (this.sending) {
        return;
    }

    if (this.send_queue.length <= 0) {
        this.sending = false;
        return;
    }

    this.sending = true;
    var that = this;

    var payloadEncoder = function(data) {
        var s = [];
        for (var k in data) {
            s.push([encodeURIComponent(k), encodeURIComponent(data[k])].join("="));
        }
        return s.join("&");
    };

    var payloads = [];
    while (this.send_queue.length > 0) {
        var sd = this.send_queue[0];
        var data = sd[0];
        data.qt = (new Date()).getTime() - sd[1].getTime(); // 数据发生和发送的时间差，单位毫秒
        data.z = Math.floor(Math.random() * 2147483648);



        var payload = payloadEncoder(data);
        var old_len = payloads.map(function(a) { return a.length; }).reduce(function(a, b) { return a + b; }, 0);
        var add_len = payload.length;

        // 批量上报有限制
        // 1. 单条8K
        // 2. 总共16K
        // 3. 最多20条
        if (old_len + add_len > 16 * 1024 || add_len > 8 * 1024 || payloads.length >= 20) {
            // 但是要保证至少有单次上报的数据
            if (payloads.length > 0) {
                break;
            }
        }

        payloads.push(payload);
        this.send_queue.shift();

        console.log(["ga.queue.presend[" + (payloads.length - 1) + "]", data]);
    }

    var payloadData = payloads.join("\r\n");

    var apiUrl = 'https://www.google-analytics.com/collect';
    if (payloads.length > 1) {
        console.log(["ga.queue.send.batch", payloadData]);
        //使用批量上报接口
        apiUrl = 'https://www.google-analytics.com/batch';
    } else {
        console.log(["ga.queue.send.collect", payloadData]);
    }
    wx.request({
        url: apiUrl,
        data: payloadData,
        method: 'POST',
        header: {
            "content-type": "text/plain" //"application/x-www-form-urlencoded"
        },
        success: function(res) {
            // success
            console.log(["ga:success", res]);
        },
        fail: function(res) {
            // fail
            console.log(["ga:failed", res])
        },
        complete: function() {
            // complete
            that.sending = false;
            setTimeout(function() { that._do_send(); }, 0);
        }
    });
}

GoogleAnalytics.prototype.getDefaultTracker = function() {
    return this.trackers[0];
}
GoogleAnalytics.prototype.newTracker = function(tid) {
    var t = new Tracker(this, tid);
    this.trackers.push(t);
    return t;
}

function Tracker(ga, tid) {
    this.ga = ga;
    this.tid = tid || "";
    this.screenName = "";
}
Tracker.prototype.setScreenName = function(sd) {
    this.screenName = sd;
    return this;
}
Tracker.prototype.send = function(hit) {
    this.ga.send(this, hit);
    return this;
}

function Hit() {
    this.t = "";
}

// ScreenView
function ScreenViewBuilder() {
    this.type = "screenview";
    this.custom_dimensions = [];
    this.custom_metrics = [];
}
ScreenViewBuilder.prototype.setCustomDimension = function(index, dimension) {
    this.custom_dimensions.push([index, dimension]);
    return this;
}
ScreenViewBuilder.prototype.setCustomMetric = function(index, metric) {
    this.custom_metrics.push([index, metric]);
    return this;
}
ScreenViewBuilder.prototype.build = function() {
        var h = new Hit();
        h.t = this.type;
        h.cd_arr = this.custom_dimensions;
        h.cm_arr = this.custom_metrics;
        return h;
    }
    // Event
function EventBuilder() {
    this.type = "event";
    this.category = "";
    this.action = "";
    this.label = "";
    this.value = "";
    this.nonInteraction = 0;
}
EventBuilder.prototype.setCategory = function(c) {
    this.category = c;
    return this;
}
EventBuilder.prototype.setAction = function(a) {
    this.action = a;
    return this;
}
EventBuilder.prototype.setLabel = function(l) {
    this.label = l;
    return this;
}
EventBuilder.prototype.setValue = function(v) {
    this.value = v;
    return this;
}
EventBuilder.prototype.setNonInteraction = function(ni) {
    this.nonInteraction = ni;
    return this;
}
EventBuilder.prototype.build = function() {
        var h = new Hit();
        h.t = this.type;
        h.ec = this.category;
        h.ea = this.action;
        h.el = this.label;
        h.ev = this.value;
        h.ni = this.nonInteraction;
        return h;
    }
    // Social @Deprecated
function SocialBuilder() {
    this.type = "social";
    this.network = "";
    this.action = "";
    this.target = "";
}
SocialBuilder.prototype.setNetwork = function(network) {
    this.network = network;
    return this;
}
SocialBuilder.prototype.setAction = function(action) {
    this.action = action;
    return this;
}
SocialBuilder.prototype.setTarget = function(target) {
    this.target = target;
    return this;
}
SocialBuilder.prototype.build = function() {
        var h = new Hit();
        h.t = this.type;
        h.sn = this.network;
        h.sa = this.action;
        h.st = this.target;
        return h;
    }
    // Exception
function ExceptionBuilder() {
    this.type = "exception";
    this.description = "";
    this.is_fatal = true;
}
ExceptionBuilder.prototype.setDescription = function(description) {
    this.description = description;
    return this;
}
ExceptionBuilder.prototype.setFatal = function(is_fatal) {
    this.is_fatal = is_fatal;
    return this;
}
ExceptionBuilder.prototype.build = function() {
        var h = new Hit();
        h.t = this.type;
        h.exd = this.description;
        h.exf = this.is_fatal ? 1 : 0;
        return h;
    }
    // Timing
function TimingBuilder() {
    this.type = "timing";
    this.category = "";
    this.variable = "";
    this.value = 0;
    this.label = "";
}
TimingBuilder.prototype.setCategory = function(category) {
    this.category = category;
    return this;
}
TimingBuilder.prototype.setVariable = function(variable) {
        this.variable = variable;
        return this;
    }
    // 单位：毫秒
TimingBuilder.prototype.setValue = function(value) {
    this.value = value;
    return this;
}
TimingBuilder.prototype.setLabel = function(label) {
    this.label = label;
    return this;
}
TimingBuilder.prototype.build = function() {
    var h = new Hit();
    h.t = this.type;
    h.utc = this.category;
    h.utv = this.variable;
    h.utt = this.value;
    h.utl = this.label;
    return h;
}

// TODO: more HitBuilders here...


function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function buildUserAgentFromSystemInfo(si) {
    var isAndroid = si.system.toLowerCase().indexOf('android') > -1;
    var isIPad = !isAndroid && si.model.toLowerCase().indexOf('iphone') == -1;
    //console.log([isAndroid, isIPad]);
    if (isAndroid) {
        return "Mozilla/5.0 (Linux; U; " + si.system + "; " + si.model + " Build/000000) AppleWebKit/537.36 (KHTML, like Gecko)Version/4.0 Chrome/49.0.0.0 Mobile Safari/537.36 MicroMessenger/" + si.version;
    } else if (!isIPad) {
        // iOS
        var v = si.system.replace(/^.*?([0-9.]+).*?$/, function(x, y) { return y; }).replace(/\./g, '_');
        return "Mozilla/5.0 (iPhone; CPU iPhone OS " + v + " like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92 MicroMessenger/" + si.version;
    } else {
        // iPad
        var v = si.system.replace(/^.*?([0-9.]+).*?$/, function(x, y) { return y; }).replace(/\./g, '_');
        return "Mozilla/5.0 (iPad; CPU OS " + v + " like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/10A406 MicroMessenger/" + si.version;
    }
}

function getInstance(app) {
    //必须要App实例
    //if (typeof app.getCurrentPage != 'function') {
    //    var e = "Fatal Error: GoogleAnalytics.getInstance(app): The argument must be instanceof App!";
    //    console.log(e);
    //    throw e;
    //}
    app = app || {};
    if (!app.defaultGoogleAnalyticsInstance) {
        app.defaultGoogleAnalyticsInstance = new GoogleAnalytics(app);
    }
    return app.defaultGoogleAnalyticsInstance;
}

module.exports = {
    GoogleAnalytics: {
        getInstance: getInstance
    },
    HitBuilders: {
        ScreenViewBuilder: ScreenViewBuilder,
        EventBuilder: EventBuilder,
        //SocialBuilder: SocialBuilder,
        ExceptionBuilder: ExceptionBuilder,
        TimingBuilder: TimingBuilder
    }
}