import { EventData, Observable } from "tns-core-modules/data/observable";
import { HttpService } from "~/services/http.service";
import { PersistenceService } from "~/services/persistence.service";
import { QuestionService } from "~/services/question.service";
import { IPracticeStats, Result } from "~/shared/questions.model";
import { QuizUtil } from "~/shared/quiz.util";
import * as navigationModule from "../shared/navigation";

export class SummaryViewModel extends Observable {
    private _ps: IPracticeStats;
    private _isPremium: boolean = false;
    get totalQuestions() {
        return this._totalQuestions;
    }

    get accessibleQuestion() {
        return this._accessibleQuestion;
    }

    get isPremium() {
        return this._isPremium;
    }

    /*get overall() {
        const results: Array<Result> = PersistenceService.getInstance().getResult();
        let correct: number = 0;
        let total: number = 0;
        const totalExams: number = results.length;
        results.forEach((re) => {
            correct += re.correct;
            total += re.total;
        });
        const overall: Array<Result> = [];
        const percentage = total === 0 ? 0 : (correct * 100 / total);
        const percentageString: string = percentage.toFixed(2) + "%";
        const result: Result = {
            date: QuizUtil.getDateString(new Date()),
            correct,
            wrong: totalExams,
            total,
            percentage: percentageString,
            pass: percentage > 70
        };
        overall.push(result);

        return result;
    }*/

    private _totalQuestions: number = 400;
    private _accessibleQuestion: number = 100;

    constructor() {
        super();
        this.load();
    }

    load(): any {
        /*HttpService.getInstance().checkTotalQuestions().then((st) => {
            this._totalQuestions = Number(st);
            this._accessibleQuestion = QuestionService.getInstance().readQuestionSize();
            this._ps = PersistenceService.getInstance().readPracticeStats();
            this.publish();
        });*/

    }

    topUpRewards() {
        console.log("Topping up rewards....");
        QuestionService.getInstance().findPremiumRange((this._accessibleQuestion + 1), (this._accessibleQuestion + 11));
    }

    goPremium() {
        navigationModule.toPage("premium/premium");
    }

    private publish() {
        let percentage: number = 0;
        if (this._ps.attempted.length !== 0) {
            percentage = Math.floor(this._ps.correct.length * 100 / this._ps.attempted.length);
        }

        const percentageString = percentage + "%";
        console.log("this._isPremium...", this._isPremium);
        this._isPremium = false;

        const practiceStatsLabel = this._ps.attempted.length + " of " + this._accessibleQuestion
            + " with " + percentageString;
        this.notify({ object: this, eventName: Observable.propertyChangeEvent,
                      propertyName: "totalQuestions", value: this._totalQuestions});
        this.notify({ object: this, eventName: Observable.propertyChangeEvent,
                      propertyName: "accessibleQuestion", value: this._accessibleQuestion});
        this.notify({ object: this, eventName: Observable.propertyChangeEvent,
                      propertyName: "attempted", value: this._ps.attempted.length});
        this.notify({ object: this, eventName: Observable.propertyChangeEvent,
                      propertyName: "correct", value: this._ps.correct.length});
        this.notify({ object: this, eventName: Observable.propertyChangeEvent,
                      propertyName: "percentage", value: percentageString});
        this.notify({ object: this, eventName: Observable.propertyChangeEvent,
                      propertyName: "practiceStatsLabel", value: practiceStatsLabel});
        this.notify({ object: this, eventName: Observable.propertyChangeEvent,
                      propertyName: "isPremium", value: this._isPremium});
    }
}
