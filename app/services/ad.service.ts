import * as appSettings from "application-settings";
import { screen } from "platform";
import * as ads from "../services/ads.js";
import * as constantsModule from "../shared/constants";
import { HttpService } from "./http.service";

export class AdService {

    get showAd(): boolean {
        return this._showAd;
    }

    set showAd(showAd: boolean) {
        this._showAd = showAd;
    }

    static getInstance(): AdService {
        return AdService._instance;
    }

    private static _instance: AdService = new AdService();

    private _showAd: boolean;

    constructor() {
        this._showAd = true;
        if (!appSettings.hasKey(constantsModule.PREMIUM)) {
            HttpService.getInstance().showAds().then((show) => {
                this._showAd = show === "true";
            });
        } else {

            this._showAd = false;
        }

    }

    showInterstitial() {
        if (this._showAd) {
            ads.showInterstitial();
        }
    }

    showSmartBanner() {
        if (this._showAd) {
            ads.showSmartBanner();
        }
    }

    hideAd() {
        if (this._showAd) {
            ads.hideBanner();
        }
    }

    getAdHeight(): number {
        let height = 32;
        const screenHeight: number = screen.mainScreen.heightDIPs;
        if (screenHeight > 400 && screenHeight < 721) {
            height = 50;
        } else if (screenHeight > 720) {
            height = 90;
        }

        return height;
    }
}
