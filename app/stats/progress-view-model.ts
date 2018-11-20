import { EventData, Observable } from "tns-core-modules/data/observable";
import { PersistenceService } from "~/services/persistence.service";
import { Result } from "~/shared/questions.model";
import { QuizUtil } from "~/shared/quiz.util";

export class ProgressViewModel extends Observable {

    constructor() {
        super();
    }

    get results() {
        const results: Array<Result> = PersistenceService.getInstance().getResult();

        return results.reverse();
    }

    get overall() {
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
    }

    resetExamStats() {
        PersistenceService.getInstance().resetExamStats();
    }
}
