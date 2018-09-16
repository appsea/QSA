import {EventData, Observable} from "data/observable";
import {Result, State} from "../questions.model";
import * as navigationModule from '../navigation';
import * as constantsModule from '../constants';
import {QuestionUtil} from "../../services/question.util";
import {PersistenceService} from "../../services/persistence.service";
import {QuizUtil} from "../quiz.util";

export class ResultViewModel extends Observable {
    private _state: State;
    private _result: Result;

    constructor(state: State) {
        super();
        this._state = state;
        this.process();
        this.initData();
    }

    private initData() {
        this.set("result",
            [
                {Brand: "Correct", Count: this._result.correct},
                {Brand: "Wrong", Count: this._result.wrong},
                {Brand: "Skipped", Count: this._result.skipped}
            ]);
    }

    public process(): void {
        this.calculateResult();
        PersistenceService.getInstance().saveResult(this._result);
    }

    calculateResult() {
        let correct: number = 0;
        let wrong: number = 0;
        let skipped: number = 0;
        let total: number = this._state.questions.length;
        for (const question of this._state.questions) {
            if (QuestionUtil.isCorrect(question)) {
                correct = correct + 1;
            } else if (QuestionUtil.isSkipped(question)) {
                skipped = skipped + 1;
            } else {
                wrong = wrong + 1;
            }
        }
        let percentage = (correct * 100 / this._state.questions.length);
        let percentageString: string = percentage.toFixed(2);
        this._result = {
            itemType: this._state.mode,
            date: QuizUtil.getDateString(new Date()),
            correct: correct,
            wrong: wrong,
            skipped: skipped,
            total: total,
            percentage: percentageString + '%',
            pass: percentage > constantsModule.PASSING_PERCENTAGE
        };
    }

    get percentage() {
        return this._result.percentage;
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

    get pass() {
        return this._result.pass;
    }

    detailedResult() {
        navigationModule.gotoDetailsPage(this._state);
    }
}