import {EventData, Observable} from "data/observable";
import {QuizUtil} from "../shared/quiz.util";
import {PersistenceService} from "../services/persistence.service";
import {Result} from "../shared/questions.model";

export class ProgressViewModel extends Observable {

    constructor() {
        super();
    }

    get results() {
        let results: Array<Result> = PersistenceService.getInstance().getResult();
        //this.hardResults().forEach(r => results.push(r));
        return results.reverse();
    }

    get overall() {
        let results: Array<Result> = PersistenceService.getInstance().getResult();
        let correct: number = 0;
        let total: number = 0;
        let totalExams: number = results.length;
        results.forEach(re => {
            correct += re.correct;
            total += re.total;
        });
        let overall: Array<Result> = [];
        let percentage = total == 0 ? 0 : (correct * 100 / total);
        let percentageString: string = percentage.toFixed(2) + '%';
        let result: Result = {
            date: QuizUtil.getDateString(new Date()),
            correct: correct,
            wrong: totalExams,
            total: total,
            percentage: percentageString,
            pass: percentage > 70
        };
        overall.push(result);
        return result;
    }

    /*public hardResults(): Array<Result> {
        let date: Date = new Date();
        let results: Array<Result> = [
            {
                date: QuizUtil.getDateString(date),
                correct: 15,
                wrong: 5,
                skipped: 9,
                total: 25,
                percentage: "14.15%",
                pass: true
            },
            {
                date: QuizUtil.getDateString(date),
                correct: 116,
                wrong: 5,
                skipped: 9,
                total: 125,
                percentage: "18.15%",
                pass: false
            },
            {
                date: QuizUtil.getDateString(date),
                correct: 17,
                wrong: 5,
                skipped: 9,
                total: 25,
                percentage: "12.16%",
                pass: true
            },
            {
                date: QuizUtil.getDateString(date),
                correct: 18,
                wrong: 5,
                skipped: 9,
                total: 25,
                percentage: "12.15%",
                pass: true
            },
            {
                date: QuizUtil.getDateString(date),
                correct: 19,
                wrong: 5,
                skipped: 9,
                total: 25,
                percentage: "14.15%",
                pass: true
            },
            {
                date: QuizUtil.getDateString(date),
                correct: 19,
                wrong: 5,
                skipped: 9,
                total: 25,
                percentage: "14.15%",
                pass: true
            },
            {
                date: QuizUtil.getDateString(date),
                correct: 19,
                wrong: 5,
                skipped: 9,
                total: 25,
                percentage: "14.15%",
                pass: true
            },
            {
                date: QuizUtil.getDateString(date),
                correct: 19,
                wrong: 5,
                skipped: 9,
                total: 25,
                percentage: "14.15%",
                pass: true
            },
            {
                date: QuizUtil.getDateString(date),
                correct: 19,
                wrong: 5,
                skipped: 9,
                total: 25,
                percentage: "14.15%",
                pass: true
            }
        ];
        return results;
    }*/

    resetExamStats() {
        PersistenceService.getInstance().resetExamStats();
    }
}