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
> 增强型电子商务数据只能随现有的匹配（例如 `screenview` 或 `event`）一起发送。如果您设置了电子商务值但没有发送任何匹配，或在设置电子商务值之前就发送了匹配，则系统将不会发送电子商务数据。   
> 
> 并且需要在Google Analytics后台，在对应的媒体资源中启用 **增强型电子商务功能** 。

.   

> **提醒** 以下示例需要用到 `HitBuilders`, `Product`, `ProductAction`, `Promotion`
> ```js
> // import 
> var ga = require('path/to/ga.js');
> var HitBuilders = ga.HitBuilders;
> var Product = ga.Product;
> var ProductAction = ga.ProductAction;
> var Promotion = ga.Promotion;
> ```


### 衡量展示

要衡量产品展示，请构建 `Product` 对象，并使用 `addImpression` 方法随匹配发送此对象。`Product` 必须有 `name` 或 `id` 值。其他所有值都非必需，可以不用设置。

```js
// 在一个 "Search Results" 的列表中展示了商品 P12345
var product = new Product()
    .setId("P12345")
    .setName("Android Warhol T-Shirt")
    .setCategory("Apparel/T-Shirts")
    .setBrand("Google")
    .setVariant("Black") // 款式
    .setPosition(1) // 在列表中位置
    .setCustomDimension(1, "Member"); // 产品范围的自定义维度#1
var builder = new HitBuilders.ScreenViewBuilder()
    .addImpression(product, "Search Results");

    // 在同一个列表中可以加入更多商品
    // .addImpression(product2, "Search Results")

    // 也可以加入更多列表
    // .addImpression(product3, "Search Results2")

var t = getApp().getTracker();
t.setScreenName("searchResults");
t.send(builder.build());
```

### 衡量操作

操作的衡量方法如下：使用 `addProduct` 方法和 `Product` 对象来添加产品详情，并使用 `setProductAction` 方法和 `ProductAction` 对象来指定用户执行的操作。

例如，以下代码衡量对搜索结果列表中展示的某个产品的选择：

```js
var product =  new Product()
    .setId("P12345")
    .setName("Android Warhol T-Shirt")
    .setCategory("Apparel/T-Shirts")
    .setBrand("Google")
    .setVariant("Black")
    .setPosition(1)
    .setCustomDimension(1, "Member");
var productAction = new ProductAction(ProductAction.ACTION_CLICK)
    .setProductActionList("Search Results");
var builder = new HitBuilders.ScreenViewBuilder()
    .addProduct(product)
    .setProductAction(productAction);

var t = getApp().getTracker();
t.setScreenName("searchResults");
t.send(builder.build());
```

### 合并展示和操作数据

既有产品展示又有操作时，可以将两者合并到同一次匹配中进行衡量。

下例显示了如何衡量一次在相关产品部分中的展示以及一次产品详情查看：

```js
// The product from a related products section.
var relatedProduct =  new Product()
    .setId("P12346")
    .setName("Android Warhol T-Shirt")
    .setCategory("Apparel/T-Shirts")
    .setBrand("Google")
    .setVariant("White")
    .setPosition(1);

// The product being viewed.
var viewedProduct =  new Product()
    .setId("P12345")
    .setName("Android Warhol T-Shirt")
    .setCategory("Apparel/T-Shirts")
    .setBrand("Google")
    .setVariant("Black")
    .setPosition(1);

var productAction = new ProductAction(ProductAction.ACTION_DETAIL);
var builder = new HitBuilders.ScreenViewBuilder()
    .addImpression(relatedProduct, "Related Products")
    .addProduct(viewedProduct)
    .setProductAction(productAction);

var t = getApp().getTracker();
t.setScreenName("product");
t.send(builder.build());
```

一般购物流程是展示列表，点击查看商品详情，加入购物车，结账。

下面是把一个商品加入购物车的例子：

```js
var product =  new Product()
    .setId("P12345"); // Id或者Name其中一个必须设置
var productAction = new ProductAction(ProductAction.ACTION_ADD);
var builder = new HitBuilders.ScreenViewBuilder()
    .addProduct(product)
    .setProductAction(productAction);

var t = getApp().getTracker();
t.setScreenName("transaction");
t.send(builder.build());    
```

下表列出商品所有操作：

| 参数值 | 说明 |
| --- | --- |
| `ProductAction.ACTION_ADD` | 把商品加入购物车 |
| `ProductAction.ACTION_CHECKOUT` | 描述结算流程，可以分几步进行 |
| `ProductAction.ACTION_CHECKOUT_OPTION` | 结算选项，比如选择支付方式，选择快递方式等 |
| `ProductAction.ACTION_CLICK` | 商品点击操作 |
| `ProductAction.ACTION_DETAIL` | 查看商品详情 |
| `ProductAction.ACTION_PURCHASE` | 交易，订单支付完成 |
| `ProductAction.ACTION_REFUND` | 退款 |
| `ProductAction.ACTION_REMOVE` | 商品从购物车移除 |


### 衡量交易

交易的衡量方法如下：使用 `addProduct` 方法和 `Product` 对象来添加产品详情，并使用 `setProductAction` 方法和 `ProductAction` 对象来指定购买操作。总收入、税费、运费等交易级详情在 `ProductAction` 对象中提供：

```js
var product =  new Product()
    .setId("P12345")
    .setName("Android Warhol T-Shirt")
    .setCategory("Apparel/T-Shirts")
    .setBrand("Google")
    .setVariant("Black")
    .setPrice(29.20)
    .setCouponCode("APPARELSALE")
    .setQuantity(1);
var productAction = new ProductAction(ProductAction.ACTION_PURCHASE)
    .setTransactionId("T12345")
    .setTransactionAffiliation("Google Store - Online")
    .setTransactionRevenue(37.39) // 【重要】这个是订单总价，包含了 税费 和 运费
    .setTransactionTax(2.85)
    .setTransactionShipping(5.34)
    .setTransactionCouponCode("SUMMER2013");
var builder = new HitBuilders.ScreenViewBuilder()
    .addProduct(product)
    .setProductAction(productAction);

var t = getApp().getTracker();
t.setScreenName("transaction");
t.send(builder.build());
```

### 指定货币

默认情况下，您可以通过 Google Analytics（分析）的管理网络界面为所有交易和商品配置一种通用的全局货币。

局部货币必须按 ISO 4217 标准指定。如需支持的完整转换货币列表，请参阅[货币代码参考文档](https://developers.google.com/analytics/devguides/platform/features/currencies)。

局部货币使用 currencyCode 跟踪器属性来指定。例如，此跟踪器将以欧元发送货币金额值：

```js
var t = getApp().getTracker();
t.setScreenName("transaction");
t.set("&cu", "EUR");  // Set tracker currency to Euros.
t.send(builder.build());
```

> 要详细了解 Google Analytics（分析）中的货币转换机制，请参阅电子商务功能参考中的[多种货币](https://developers.google.com/analytics/devguides/platform/features/ecommerce#specifying-currencies)部分。

### 衡量退款

要为整个交易退款，请使用 `setProductAction` 方法和 `ProductAction` 对象来指定交易 ID 和退款操作类型：

```js
// Refund an entire transaction.
var productAction = new ProductAction(ProductAction.ACTION_REFUND)
    .setTransactionId("T12345");  // Transaction ID is only required field for a full refund.
var builder = new HitBuilders.ScreenViewBuilder()
    .setProductAction(productAction);

var t = getApp().getTracker();
t.setScreenName("refund");
t.send(builder.build());
```

如果未找到相符的交易，则退款将不会得到处理。

要衡量部分退款，请使用 `setProductAction` 方法和 `ProductAction` 对象来指定要退款的交易 ID、产品 ID 和产品数量：

```js
// Refund a single product.
var product =  new Product()
    .setId("P12345")  // Product ID is required for partial refund.
    // .setPrice(20.23) // 退款时可以不是原价退还
    .setQuantity(1);  // Quanity is required for partial refund.
var productAction = new ProductAction(ProductAction.ACTION_REFUND)
    .setTransactionId("T12345");  // Transaction ID is required for partial refund.
var builder = new HitBuilders.ScreenViewBuilder()
    .addProduct(product)
    .setProductAction(productAction);

var t = getApp().getTracker();
t.setScreenName("refundProduct");
t.send(builder.build());
```

### 为退款使用非互动事件

如果您需要使用事件来发送退款数据，但该事件不属于通常衡量的行为（即并非由用户发起），则建议您发送非互动事件。这可让特定指标免受该事件的影响。例如：

```js
// Refund an entire transaction.
var productAction = new ProductAction(ProductAction.ACTION_REFUND)
    .setTransactionId("T12345");
var builder = new HitBuilders.EventBuilder()
    .setProductAction(productAction)
    .setNonInteraction(true) // 设置非互动事件
    .setCategory("Ecommerce")
    .setAction("Refund");

var t = getApp().getTracker();
t.send(builder.build());
```

### 衡量结帐流程

为衡量结帐流程中的每个步骤，您需要：

1. 添加跟踪代码，以衡量结帐流程中的每一步。
2. 如果适用，添加跟踪代码以衡量结帐选项。
3. （可选）设置直观易懂的步骤名称以用于结帐渠道报告，方法是在网页界面的“管理”部分中配置**电子商务设置**。

#### 1. 衡量结帐步骤

对于结帐流程中的每一步，您都需要实现相应的跟踪代码，以便向 Google Analytics（分析）发送数据。

**Step 字段**

对于要衡量的每一个结帐步骤，您都应加入 `step` 值。此值用于将结帐操作映射到您在电子商务设置中为每个步骤配置的标签。

> 注意：如果您的结帐流程只有一步，或是您没有在电子商务设置中配置结帐渠道，则可以不设置 `step` 字段。

**Option 字段**

在衡量某个结帐步骤时，如果您有关于此步骤的更多信息，则可以为 `checkout` 操作设置 `option` 字段来捕获此信息，例如用户的默认付款方式（如“Visa”）。

#### 衡量某个结帐步骤

要衡量某个结帐步骤，请使用 `addProduct` 方法和 `Product` 对象来添加产品详情，并使用 `setProductAction` 方法和 `ProductAction` 对象来指示结帐操作。如果适用，还可以设置该结帐步骤的 `step` 和 `option`。

下例显示了如何衡量结帐流程的第一步（一个产品，拥有关于付款方式的额外信息）：

```js
var product =  new Product()
    .setId("P12345")
    .setName("Android Warhol T-Shirt")
    .setCategory("Apparel/T-Shirts")
    .setBrand("Google")
    .setVariant("Black")
    .setPrice(29.20)
    .setQuantity(1);
// Add the step number and additional info about the checkout to the action.
var productAction = new ProductAction(ProductAction.ACTION_CHECKOUT)
    .setCheckoutStep(1)
    .setCheckoutOptions("Visa");
var builder = new HitBuilders.ScreenViewBuilder()
    .addProduct(product)
    .setProductAction(productAction);

var t = getApp().getTracker();
t.setScreenName("checkoutStep1");
t.send(builder.build());
```

#### 2. 衡量结帐选项

结帐选项可让您衡量关于结帐状态的额外信息。有时您已经衡量了某个结帐步骤，但在用户设置了选项之后，关于此步骤有了新的额外信息，在这种情况下，结帐选项就可以派上用场。例如，用户选择了送货方式。

要衡量结帐选项，请使用 `setProductAction` 来指示结帐选项，并加入步骤序号和选项说明信息。

> 请注意：您不应设置任何产品或展示数据。

您很可能希望在用户执行特定操作进入结帐流程中的下一步时衡量此操作。例如：

```js
// (On "Next" button click.)
var productAction = new ProductAction(ProductAction.ACTION_CHECKOUT_OPTION)
    .setCheckoutStep(1)
    .setCheckoutOptions("FedEx");
var builder = new HitBuilders.EventBuilder()
    .setProductAction(productAction)
    .setCategory("Checkout")
    .setAction("Option");

var t = getApp().getTracker();
t.send(builder.build());

// Advance to next page.
```

#### 3. 结帐渠道配置

您可以为结帐流程中的每一步指定一个描述性的名称，以在报告中使用。要配置此类名称，请转到 Google Analytics（分析）网络界面的管理部分，选择相应数据视图（配置文件），然后点击电子商务设置。请按照相应电子商务设置说明，为要跟踪的每个结帐步骤设置标签。

> 注意：如果您不配置结帐步骤名称，它们将会显示为“第 1 步”、“第 2 步”、“第 3 步”等等。

### 衡量内部促销

增强型电子商务功能支持对内部促销信息的展示次数和点击次数进行衡量，例如对促销活动进行宣传的横幅。

#### 促销信息展示

内部促销信息的展示一般在初始屏幕浏览发生时衡量，并使用 `addPromotion` 方法和 `Promotion` 对象来指定促销详情。例如：

```js
var promotion = new Promotion()
    .setId("PROMO_1234")
    .setName("Summer Sale")
    .setCreative("summer_banner2")
    .setPosition("banner_slot1");
var builder = new HitBuilders.ScreenViewBuilder()
    .addPromotion(promotion);

var t = getApp().getTracker();
t.setScreenName("promotions");
t.send(builder.build());
```
> **重要提示：** 虽然可以为促销信息展示设置操作，但该操作不能是促销信息点击操作。如果您要衡量促销信息点击操作，应在促销信息展示之后，在单独的匹配中发送该操作。

#### 促销信息点击

内部促销信息点击的衡量方法如下：使用 `addPromotion` 方法和 `Promotion` 对象以及 `setPromotionAction` 方法来指示促销信息点击操作。例如：

```js
var promotion = new Promotion()
    .setId("PROMO_1234")
    .setName("Summer Sale")
    .setCreative("summer_banner2")
    .setPosition("banner_slot1");

HitBuilders.EventBuilder builder = new HitBuilders.EventBuilder()
    .addPromotion(promotion)
    .setPromotionAction(Promotion.ACTION_CLICK)
    .setCategory("Internal Promotions")
    .setAction("click")
    .setLabel("Summer Sale");

var t = getApp().getTracker();
t.send(builder.build());
```

促销信息的操作只有2个：

| 参数值 | 说明 |
| --- | --- |
| `Promotion.ACTION_VIEW` | 这是默认操作，只需要在 `HitBuilder` 上调用 `addPromotion` 即可 |
| `Promotion.ACTION_CLICK` | 促销信息点击操作，需要在 `HitBuilder` 上用 `setPromotionAction` 设置  |