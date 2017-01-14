## 电子商务活动相关

典型的增强型电子商务实现将会衡量产品展示次数以及以下任一操作：

* 选择产品。
* 查看产品详情。
* 内部促销信息的展示和选择。
* 向购物车中添加产品或从中移除产品。
* 开始产品结帐流程。
* 购买和退款。

> **注意：** 
> 
> 增强型电子商务数据只能随现有的匹配（例如 screenview 或 event）一起发送。如果您设置了电子商务值但没有发送任何匹配，或在设置电子商务值之前就发送了匹配，则系统将不会发送电子商务数据。   
> 
> 并且在Google Analytics后台，在对应的媒体资源中启用 **增强型电子商务功能** 。


### 衡量展示

要衡量产品展示，请构建 Product 对象，并使用 addImpression 方法随匹配发送此对象。Product 必须有 name 或 id 值。其他所有值都非必需，可以不用设置。

```js
// import 
var ga = require('path/to/ga.js');
var HitBuilders = ga.HitBuilders;
var Product = ga.Product;
// ....
var product = new Product()
    .setId("P12345")
    .setName("Android Warhol T-Shirt")
    .setCategory("Apparel/T-Shirts")
    .setBrand("Google")
    .setVariant("Black")
    .setPosition(1)
    .setCustomDimension(1, "Member");
var builder = new HitBuilders.ScreenViewBuilder()
    .addImpression(product, "Search Results");

var t = getApp().getTracker();
t.setScreenName("searchResults");
t.send(builder.build());
```
