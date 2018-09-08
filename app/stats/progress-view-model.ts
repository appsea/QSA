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

    resetExamStats() {
        PersistenceService.getInstance().resetExamStats();
    }
}