import {IQuestion} from "../shared/questions.model";
import {SettingsService} from "./settings.service";
import {Observable} from "rxjs/Observable";
import * as constantsModule from '../shared/constants';

const httpModule = require("http");

export class HttpService {

    static getInstance(): HttpService {
        return HttpService._instance;
    }

    private static _instance: HttpService = new HttpService();

    private questions: Array<IQuestion> = [];
    private _settingsService: SettingsService;
    private _checked: boolean;

    constructor() {
        this._settingsService = SettingsService.getInstance();
        this._checked = false;
    }

    public showAds(): Promise<string> {
        let url = constantsModule.FIREBASE_URL + "ads.json"
        return httpModule.getString(url);
    }

    public getQuestions<T>(): Promise<T> {
        let url = constantsModule.FIREBASE_URL + "questions.json"
        return httpModule.getJSON(url);
    }

    public findLatestQuestionVersion(): Promise<string> {
        let url = constantsModule.FIREBASE_URL + "questionVersion.json"
        return httpModule.getString(url);
    }

    public checkPlayStoreVersion(): Promise<string> {
        let url = constantsModule.FIREBASE_URL + "playStoreVersion.json"
        return httpModule.getString(url);
    }

    public httpPost(url:string, data:any) {
        httpModule.request({
            url: url,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        });
    }
}