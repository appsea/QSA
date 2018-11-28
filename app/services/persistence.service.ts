/**
 * Created by rakesh on 15-Nov-2017.
 */
import * as appSettings from "application-settings";
import { Observable } from "tns-core-modules/data/observable";
import {FLAG_QUESTION, PRACTICE, PRACTICE_STATS, PREMIUM, RESULT, WRONG_QUESTION} from "~/shared/constants";
import { IPracticeStats, IQuestion, Result } from "~/shared/questions.model";

export class PersistenceService {

    static getInstance(): PersistenceService {
        return PersistenceService._instance;
    }

    private static _instance: PersistenceService = new PersistenceService();

    readPracticeStats(): IPracticeStats {
        return appSettings.hasKey(PRACTICE_STATS) ? JSON.parse(appSettings.getString(PRACTICE_STATS))
            : {attempted: new Array<number>(), correct: new Array<number>()};
    }

    readWrongQuestions(): Array<IQuestion> {
        return this.readQuestions(WRONG_QUESTION);
    }

    readFlaggedQuestions(): Array<IQuestion> {
        return this.readQuestions(FLAG_QUESTION);
    }

    addQuestions(key: string, questions: Array<IQuestion>) {
        appSettings.setString(key, JSON.stringify(questions));
    }

    addResult(results: Array<Result>) {
        appSettings.setString(RESULT, JSON.stringify(results));
    }

    getResult(): Array<Result> {
        let items: Array<Result> = [];
        if (appSettings.hasKey(RESULT)) {
            items = JSON.parse(appSettings.getString(RESULT));
        }

        return items;
    }

    saveResult(result: Result): void {
        if (appSettings.hasKey(RESULT)) {
            const items: Array<Result> = JSON.parse(appSettings.getString(RESULT));
            items.push(result);
            appSettings.setString(RESULT, JSON.stringify(items));
        } else {
            const items: Array<Result> = [];
            items.push(result);
            appSettings.setString(RESULT, JSON.stringify(items));
        }
    }

    savePracticeStats(practiceStats: IPracticeStats): any {
        appSettings.setString(PRACTICE_STATS, JSON.stringify(practiceStats));
    }

    resetExamStats(): void {
        appSettings.remove(RESULT);
    }

    isPremium(): boolean {
        return appSettings.hasKey(PREMIUM);
    }

    private readQuestions(key: string): Array<IQuestion> {
        let questions: Array<IQuestion>;
        try {
            questions = this.hasBookmarkedQuestions(key) ? JSON.parse(appSettings.getString(key)) : [];
        } catch (error) {
            questions = [];
        }

        return questions;
    }

    private hasBookmarkedQuestions(key: string): boolean {
        return appSettings.hasKey(key);
    }
}
