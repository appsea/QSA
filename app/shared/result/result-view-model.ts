import { EventData, Observable } from "tns-core-modules/data/observable";
import { PersistenceService } from "~/services/persistence.service";
import { QuestionUtil } from "~/services/question.util";
import * as constantsModule from "../constants";
import * as navigationModule from "../navigation";
import { Result, State } from "../questions.model";
import { QuizUtil } from "../quiz.util";

export class ResultViewModel extends Observable {

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
    private _state: State;
    private _result: Result;

    constructor(state: State) {
        super();
        this._state = state;
        this.process();
        this.initData();
    }

    process(): void {
        this.calculateResult();
        PersistenceService.getInstance().saveResult(this._result);
    }

    calculateResult() {
        let correct: number = 0;
        let wrong: number = 0;
        let skipped: number = 0;
        const total: number = this._state.questions.length;
        for (const question of this._state.questions) {
            if (QuestionUtil.isCorrect(question)) {
                correct = correct + 1;
            } else if (QuestionUtil.isSkipped(question)) {
                skipped = skipped + 1;
            } else {
                wrong = wrong + 1;
            }
        }
        const percentage = (correct * 100 / this._state.questions.length);
        const percentageString: string = percentage.toFixed(2);
        this._result = {
            itemType: this._state.mode,
            date: QuizUtil.getDateString(new Date()),
            correct,
            wrong,
            skipped,
            total,
            percentage: percentageString + "%",
            pass: percentage > constantsModule.PASSING_PERCENTAGE
        };
    }

    detailedResult() {
        navigationModule.gotoDetailsPage(this._state);
    }

    private initData() {
        this.set("result",
            [
                {Brand: "Correct", Count: this._result.correct},
                {Brand: "Wrong", Count: this._result.wrong},
                {Brand: "Skipped", Count: this._result.skipped}
            ]);
    }
}
