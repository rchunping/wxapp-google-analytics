interface Map<T> {
    [key: string]: T
}

export class GoogleAnalytics {
    constructor(app: any)

    setAppName(name: string): GoogleAnalytics

    setAppVersion(version: string): GoogleAnalytics

    getDefaultTracker(): Tracker

    newTracker(trackingID: string): Tracker

    setLog(flag: boolean): GoogleAnalytics

    static getInstance(app: any): GoogleAnalytics
}

export class Tracker {
    constructor(ga: GoogleAnalytics, tid: string)

    setTrackerServer(server: string): Tracker

    get(name: string): number | string

    set(name: string, value: number | string): Tracker

    setAnonymizeIp(anonymize: boolean): Tracker

    setAppId(appId: string): Tracker

    setAppInstallerId(appInstallerId: string): Tracker

    setAppName(appName: string): Tracker

    setAppVersion(appVersion: string): Tracker

    setCampaignParamsOnNextHit(uri: string): Tracker

    setClientId(clientId: string): Tracker

    setEncoding(encoding: string): Tracker

    setLanguage(language: string): Tracker

    setLocation(location: string): Tracker

    setScreenColors(screenColors: string): Tracker

    setScreenName(screenName: string): Tracker

    setScreenResolution(width: number, height: number): Tracker

    setViewportSize(viewportSize: string): Tracker

    send(hit: Map<string | number>): Tracker
}

export class Product {
    setBrand(brand: string): Product

    setCategory(category: string): Product

    setCouponCode(couponCode: string): Product

    setCustomDimension(index: number, value: string): Product

    setCustomMetric(index: number, value: number): Product

    setId(id: string): Product

    setName(name: string): Product

    setPosition(position: number): Product

    setPrice(price: number): Product

    setQuantity(quantity: number): Product

    setVariant(variant: number): Product

}

export class Promotion {
    constructor()

    static ACTION_CLICK: string
    static ACTION_VIEW: string

    setCreative(creative: string): Promotion

    setId(id: string): Promotion

    setName(name: string): Promotion

    setPosition(positionName: string): Promotion
}

export class ProductAction {
    constructor()

    static ACTION_ADD: string
    static ACTION_CHECKOUT: string
    static ACTION_CHECKOUT_OPTION: string
    // @Deprecated use ACTION_CHECKOUT_OPTION
    // ProductAction.ACTION_CHECKOUT_OPTIONS = "checkout_options";
    static ACTION_CLICK: string
    static ACTION_DETAIL: string
    static ACTION_PURCHASE: string
    static ACTION_REFUND: string
    static ACTION_REMOVE: string

    setCheckoutOptions(options: string): ProductAction

    setCheckoutStep(step: number): ProductAction

    setProductActionList(productActionList: string): ProductAction

    setProductListSource(productListSource: string): ProductAction

    setTransactionAffiliation(transactionAffiliation: string): ProductAction

    setTransactionCouponCode(transactionCouponCode: string): ProductAction

    setTransactionId(transactionId: string): ProductAction

    setTransactionRevenue(revenue: number): ProductAction

    setTransactionShipping(shipping: number): ProductAction

    setTransactionTax(tax: number): ProductAction
}

export class CampaignParams {
    constructor()

    set(name: string, value: string | number): CampaignParams

    toUrl(): string

    static parseFromPageOptions(options: Map<string>, map: Map<string>): CampaignParams

    static buildFromWeappScene(scene: number): CampaignParams

    static parseFromUrl(url: string): CampaignParams
}

declare namespace HitBuilders {

    export class HitBuilder {
        get(name: string): number | string

        set(name: string, value: number | string): HitBuilder

        setAll(params: any): HitBuilder

        addImpression(product: Product, impressionList: string): HitBuilder

        addProduct(product: Product): HitBuilder

        addPromotion(promotion: Promotion): HitBuilder

        setProductAction(action: ProductAction): HitBuilder

        setPromotionAction(action: string): HitBuilder

        setCampaignParamsFromUrl(url: string): HitBuilder

        setCustomDimension(index: number, dimension: string): HitBuilder

        setCustomMetric(index: number, metric: number): HitBuilder

        setNewSession(): HitBuilder

        setNonInteraction(nonInteraction: boolean): HitBuilder

        setHitType(hitType: string): HitBuilder

        build(): Map<string | number>
    }


    export class ScreenViewBuilder extends HitBuilder {
    }

    export class EventBuilder extends HitBuilder {
        setCategory(category: string): EventBuilder

        setAction(action: string): EventBuilder

        setLabel(label: string): EventBuilder

        setValue(value: number): EventBuilder
    }

    export class SocialBuilder extends HitBuilder {
        setNetwork(network: string): SocialBuilder

        setAction(action: string): SocialBuilder

        setTarget(target: string): SocialBuilder
    }

    export class ExceptionBuilder extends HitBuilder {
        setDescription(description: string): ExceptionBuilder

        setFatal(is_fatal: bool): ExceptionBuilder
    }

    export class TimingBuilder extends HitBuilder {
        setCategory(category: string): TimingBuilder

        setVariable(variable: string): TimingBuilder

        setValue(value: number): TimingBuilder

        setLabel(label: string): TimingBuilder
    }
}