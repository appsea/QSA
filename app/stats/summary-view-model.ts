import { EventData, Observable } from "tns-core-modules/data/observable";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { HttpService } from "~/services/http.service";
import { PersistenceService } from "~/services/persistence.service";
import { QuestionService } from "~/services/question.service";
import { ConnectionService } from "~/shared/connection.service";
import { IPracticeStats, IResult } from "~/shared/questions.model";
import { QuizUtil } from "~/shared/quiz.util";
import * as navigationModule from "../shared/navigation";

export class SummaryViewModel extends Observable {

    private _ps: IPracticeStats;

    private _mock: IResult;
    private _practiceAccuracy: number;
    private _practiceCoverage: number;
    private _serverQuestionSize: number = 434;
    private _questionSize: number = 200;
    private _rewards: number = 10;
    private _isPremium: boolean = false;

    private _allQuestionsLoaded: boolean = false;

    get overall() {
        const results: Array<IResult> = PersistenceService.getInstance().getResult();
        let correct: number = 0;
        let total: number = 0;
        const totalExams: number = results.length;
        results.forEach((re) => {
            correct += re.correct;
            total += re.total;
        });
        const overall: Array<IResult> = [];
        const percentage = total === 0 ? 0 : Math.floor(correct * 100 / total);
        const percentageString: string = percentage + "%";
        const result: IResult = {
            date: QuizUtil.getDateString(new Date()),
            correct,
            total,
            totalExams,
            percentage: percentageString,
            pass: percentage > 70
        };
        overall.push(result);

        return result;
    }

    constructor() {
        super();
        this.load();
    }

    get ps(): IPracticeStats {
        return this._ps;
    }

    get practiceAccuracy() {
        return this._practiceAccuracy;
    }

    get practiceCoverage() {
        return this._practiceCoverage;
    }

    get mock(): IResult {
        return this._mock;
    }

    get questionSize() {
        return this._questionSize;
    }

    get serverQuestionSize() {
        return this._serverQuestionSize;
    }

    get isPremium() {
        return this._isPremium;
    }

    get allQuestionsLoaded() {
        return this._allQuestionsLoaded;
    }

    get rewards() {
        return this._rewards;
    }

    load(): any {
        console.log("Load called.....");
        this.calculate();
        if (ConnectionService.getInstance().isConnected()) {
            HttpService.getInstance().checkTotalQuestions().then((st) => {
                this._serverQuestionSize = Number(st);
                this.calculate();
            });
        }
    }

    topUpRewards() {
        if (ConnectionService.getInstance().isConnected()) {
            QuestionService.getInstance().findPremiumRange((this._questionSize + 1),
                (this._questionSize + this._rewards));
        } else {
            dialogs.alert("Please connect to internet!!!");
        }
    }

    goPremium() {
        navigationModule.toPage("premium/premium");
    }

    private publish() {
        this.notify({ object: this, eventName: Observable.propertyChangeEvent,
                      propertyName: "serverQuestionSize", value: this._serverQuestionSize});
        this.notify({ object: this, eventName: Observable.propertyChangeEvent,
                      propertyName: "mock", value: this._mock});
        this.notify({ object: this, eventName: Observable.propertyChangeEvent,
                      propertyName: "questionSize", value: this._questionSize});
        this.notify({ object: this, eventName: Observable.propertyChangeEvent,
                      propertyName: "ps", value: this._ps});
        this.notify({ object: this, eventName: Observable.propertyChangeEvent,
                      propertyName: "premium", value: this._isPremium});
        this.notify({ object: this, eventName: Observable.propertyChangeEvent,
                      propertyName: "allQuestionsLoaded", value: this._allQuestionsLoaded});
    }

    private calculate() {
        this._isPremium = PersistenceService.getInstance().isPremium();
        this._questionSize = QuestionService.getInstance().readQuestionSize();
        console.log("this._questionSize", this._questionSize);
        this._ps = PersistenceService.getInstance().readPracticeStats();
        this._practiceAccuracy = this._ps.attempted.length === 0 ? 0
            : Math.floor(this._ps.correct.length * 100 / this._ps.attempted.length);
        this._practiceCoverage = Math.floor(this._ps.attempted.length * 100 / this._questionSize);
        this._mock = this.overall;
        this._allQuestionsLoaded = this._questionSize === this._serverQuestionSize;
        this._rewards = this._serverQuestionSize - this._questionSize > 10 ? 10
            : this._serverQuestionSize - this._questionSize;
        this.publish();
    }
}
