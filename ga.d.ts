declare module 'wxapp-ga' {


    interface Map<T> {
        [key: string]: T
    }

    export class GoogleAnalytics {

        public static getInstance(app: any): GoogleAnalytics
        constructor(app: any)

        public setAppName(name: string): GoogleAnalytics

        public setAppVersion(version: string): GoogleAnalytics

        public getDefaultTracker(): Tracker

        public newTracker(trackingID: string): Tracker

        public setLog(flag: boolean): GoogleAnalytics
    }

    export class Tracker {
        constructor(ga: GoogleAnalytics, tid: string)

        public setTrackerServer(server: string): Tracker

        public get(name: string): number | string

        public set(name: string, value: number | string): Tracker

        public setAnonymizeIp(anonymize: boolean): Tracker

        public setAppId(appId: string): Tracker

        public setAppInstallerId(appInstallerId: string): Tracker

        public setAppName(appName: string): Tracker

        public setAppVersion(appVersion: string): Tracker

        public setCampaignParamsOnNextHit(uri: string): Tracker

        public setClientId(clientId: string): Tracker

        public setEncoding(encoding: string): Tracker

        public setLanguage(language: string): Tracker

        public setLocation(location: string): Tracker

        public setScreenColors(screenColors: string): Tracker

        public setScreenName(screenName: string): Tracker

        public setScreenResolution(width: number, height: number): Tracker

        public setViewportSize(viewportSize: string): Tracker

        public send(hit: Map<string | number>): Tracker
    }

    export class Product {
        public setBrand(brand: string): Product

        public setCategory(category: string): Product

        public setCouponCode(couponCode: string): Product

        public setCustomDimension(index: number, value: string): Product

        public setCustomMetric(index: number, value: number): Product

        public setId(id: string): Product

        public setName(name: string): Product

        public setPosition(position: number): Product

        public setPrice(price: number): Product

        public setQuantity(quantity: number): Product

        public setVariant(variant: number): Product

    }

    export class Promotion {

        public static ACTION_CLICK: string
        public static ACTION_VIEW: string
        constructor()

        public setCreative(creative: string): Promotion

        public setId(id: string): Promotion

        public setName(name: string): Promotion

        public setPosition(positionName: string): Promotion
    }

    export class ProductAction {

        public static ACTION_ADD: string
        public static ACTION_CHECKOUT: string
        public static ACTION_CHECKOUT_OPTION: string
        // @Deprecated use ACTION_CHECKOUT_OPTION
        // ProductAction.ACTION_CHECKOUT_OPTIONS = "checkout_options";
        public static ACTION_CLICK: string
        public static ACTION_DETAIL: string
        public static ACTION_PURCHASE: string
        public static ACTION_REFUND: string
        public static ACTION_REMOVE: string
        constructor(action: string)

        public setCheckoutOptions(options: string): ProductAction

        public setCheckoutStep(step: number): ProductAction

        public setProductActionList(productActionList: string): ProductAction

        public setProductListSource(productListSource: string): ProductAction

        public setTransactionAffiliation(transactionAffiliation: string): ProductAction

        public setTransactionCouponCode(transactionCouponCode: string): ProductAction

        public setTransactionId(transactionId: string): ProductAction

        public setTransactionRevenue(revenue: number): ProductAction

        public setTransactionShipping(shipping: number): ProductAction

        public setTransactionTax(tax: number): ProductAction
    }

    export class CampaignParams {

        public static parseFromPageOptions(options: Map<string>, map: Map<string>): CampaignParams

        public static buildFromWeappScene(scene: number): CampaignParams

        public static parseFromUrl(url: string): CampaignParams
        constructor()

        public set(name: string, value: string | number): CampaignParams

        public toUrl(): string
    }

    export namespace HitBuilders {

        export class HitBuilder {
            public get(name: string): number | string

            public set(name: string, value: number | string): HitBuilder

            public setAll(params: any): HitBuilder

            public addImpression(product: Product, impressionList: string): HitBuilder

            public addProduct(product: Product): HitBuilder

            public addPromotion(promotion: Promotion): HitBuilder

            public setProductAction(action: ProductAction): HitBuilder

            public setPromotionAction(action: string): HitBuilder

            public setCampaignParamsFromUrl(url: string): HitBuilder

            public setCustomDimension(index: number, dimension: string): HitBuilder

            public setCustomMetric(index: number, metric: number): HitBuilder

            public setNewSession(): HitBuilder

            public setNonInteraction(nonInteraction: boolean): HitBuilder

            public setHitType(hitType: string): HitBuilder

            public build(): Map<string | number>
        }


        export class ScreenViewBuilder extends HitBuilder {
        }

        export class EventBuilder extends HitBuilder {
            public setCategory(category: string): EventBuilder

            public setAction(action: string): EventBuilder

            public setLabel(label: string): EventBuilder

            public setValue(value: number): EventBuilder
        }

        export class SocialBuilder extends HitBuilder {
            public setNetwork(network: string): SocialBuilder

            public setAction(action: string): SocialBuilder

            public setTarget(target: string): SocialBuilder
        }

        export class ExceptionBuilder extends HitBuilder {
            public setDescription(description: string): ExceptionBuilder

            public setFatal(is_fatal: boolean): ExceptionBuilder
        }

        export class TimingBuilder extends HitBuilder {
            public setCategory(category: string): TimingBuilder

            public setVariable(variable: string): TimingBuilder

            public setValue(value: number): TimingBuilder

            public setLabel(label: string): TimingBuilder
        }
    }

}
