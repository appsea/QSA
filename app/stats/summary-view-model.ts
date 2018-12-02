import { EventData, Observable } from "tns-core-modules/data/observable";
import { HttpService } from "~/services/http.service";
import { PersistenceService } from "~/services/persistence.service";
import { QuestionService } from "~/services/question.service";
import { IPracticeStats } from "~/shared/questions.model";
import * as navigationModule from "../shared/navigation";

export class SummaryViewModel extends Observable {
    private _ps: IPracticeStats;
    get totalQuestions() {
        return this._totalQuestions;
    }

    get accessibleQuestions() {
        return this._accessibleQuestion;
    }

    private _totalQuestions: number = 400;
    private _accessibleQuestion: number = 100;

    constructor() {
        super();
        this.load();
    }

    load(): any {
        HttpService.getInstance().checkTotalQuestions().then((st) => {
            this._totalQuestions = Number(st);
            this._accessibleQuestion = QuestionService.getInstance().readQuestionSize();
            this._ps = PersistenceService.getInstance().readPracticeStats();
            this.publish();
        });

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
    }
}
