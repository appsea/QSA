import * as ads from "../services/ads.js";
import {HttpService} from "./http.service";
import {screen} from "platform";
import * as constantsModule from '../shared/constants';
import * as appSettings from 'application-settings';

export class AdService {

    private static _instance: AdService = new AdService();

    private _showAd: boolean;

    static getInstance(): AdService {
        return AdService._instance;
    }

    constructor() {
        this._showAd = false;
        if (!appSettings.hasKey(constantsModule.PREMIUM)) {
            HttpService.getInstance().showAds().then((show) => {
                if (show == 'true') {
                    this._showAd = true;
                }
            })
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

    get showAd(): boolean {
        return this._showAd;
    }

    set showAd(showAd: boolean) {
        this._showAd = showAd;
    }

    getAdHeight(): number {
        let height = 32;
        let screenHeight: number = screen.mainScreen.heightDIPs;
        if (screenHeight > 400 && screenHeight < 721) {
            height = 50;
        } else if (screenHeight > 720) {
            height = 90;
        }
        return height;
    }
}