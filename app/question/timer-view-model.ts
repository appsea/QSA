import {EventData, Observable} from "data/observable";
import {clearInterval, setInterval, setTimeout} from "timer";
import {QuestionViewModel} from "./question-view-model";
import {State} from "../shared/questions.model";
import {SettingsService} from "../services/settings.service";

export class TimerViewModel extends QuestionViewModel {
    private _seconds: number = 0;
    private _minutes: number = 5;
    private _time: string = "";
    private clock: any;

    constructor(mode: string) {
        super(mode);
        this._minutes = this.state.time;
        this.startTimer();
    }

    public previous(): void {
        super.goPrevious();
    }

    public publish() {
        super.publish();
        this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: 'time', value: this._time});
    }

    public saveAndPublish(mode: string, state: State) {
        state.time = this._minutes;
        SettingsService.getInstance().saveCache(mode, state);
        this.publish();
    }

    public startTimer() {
        this.clock = setInterval(() => {
            if (this._seconds <= 0) {
                if(--this._minutes==-1){
                    this._minutes = 0;
                    this.stopTimer();
                    this.showResult();
                }else{
                    this._seconds = 59;
                }
            } else {
                this._seconds--;
            }
            this._time = (("0" + this._minutes).slice(this._minutes>99?-3:-2)) + ":"+(("0" + this._seconds).slice(-2)) + " MIN";
            this.publish();
        }, 1000);
    }

    stopTimer() {
        clearTimeout(this.clock);
    }
}