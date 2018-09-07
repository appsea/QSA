import {EventData, Observable} from "data/observable";
import {State} from "../questions.model";
import * as navigationModule from '../navigation';
import {QuestionUtil} from "../../services/question.util";
import {SettingsService} from "../../services/settings.service";
import {PersistenceService} from "../../services/persistence.service";

export class ResultViewModel extends Observable {
    _correct: number = 0;
    _percentage: string = "0";
    private _state: State;
    private _wrong: number = 0;
    private _skipped: number = 0;

    constructor(state: State) {
        super();
        this._state = state;
        this.calculateResult();
        this.initData();
    }

    private initData() {
        this.set("result",
            [
                { Brand: "Correct", Count: this._correct},
                { Brand: "Wrong", Count: this._wrong },
                { Brand: "Skipped", Count: this._skipped }
            ]);
    }

    public publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: 'state',
            value: this._state
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: 'wrong',
            value: this._wrong
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: 'percentage',
            value: this._percentage
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: 'correct',
            value: this._correct
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: 'mode',
            value: this._state.mode
        });
    }

    private showDetailedResult() {
        navigationModule.gotoResultPage(this._state);
    }

    showAnswer(): void {
    }

    public calculateResult(): void {
        for (const question of this._state.questions) {
            if (QuestionUtil.isCorrect(question)) {
                this._correct = this._correct + 1;
            } else if(QuestionUtil.isSkipped(question)){
                this._skipped = this._skipped + 1;
            } else {
                this._wrong = this._wrong + 1;
            }
        }
        this._percentage = (this._correct * 100 / this._state.questions.length).toFixed(2);
        SettingsService.getInstance().saveScore(this._state.mode, Number(this._percentage));
        PersistenceService.getInstance().saveResult(this._state);
        this.publish();
    }

    get wrong() {
        return this._wrong;
    }

    get correct() {
        return this._correct;
    }

    get percentage() {
        return this._percentage;
    }

    get totalQuestions() {
        return this._state.questions.length;
    }

    get state() {
        return this._state;
    }

    get mode() {
        return this._state.mode;
    }

    detailedResult() {
        navigationModule.gotoDetailsPage(this._state);
    }
}