import {EventData, Observable} from "data/observable";
import {ISetting} from "../shared/questions.model";
import {SettingsService} from "../services/settings.service";
import {PersistenceService} from "../services/persistence.service";

export class SettingsViewModel extends Observable {
    private _settings: ISetting;

    constructor() {
        super();
        this._settings = SettingsService.getInstance().readSettings();
        this.publish();
    }

    private publish() {
        this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: 'settings', value: this._settings});
    }

    get settings(){
        return this._settings;
    }

    save() {
        SettingsService.getInstance().saveSetting(this._settings);
    }
}