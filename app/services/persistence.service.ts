/**
 * Created by rakesh on 15-Nov-2017.
 */
import {IQuestion, Result} from "../shared/questions.model";
import * as constantsModule from '../shared/constants';
import {RESULT} from '../shared/constants';
import * as appSettings from 'application-settings';
import {Observable} from "rxjs/Observable";

export class PersistenceService {

    static getInstance(): PersistenceService {
        return PersistenceService._instance;
    }

    private static _instance: PersistenceService = new PersistenceService();

    readWrongQuestions(): Array<IQuestion> {
        return this.readQuestions(constantsModule.WRONG_QUESTION);
    }

    readFlaggedQuestions(): Array<IQuestion> {
        return this.readQuestions(constantsModule.FLAG_QUESTION);
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
            let items: Array<Result> = JSON.parse(appSettings.getString(RESULT));
            items.push(result);
            appSettings.setString(RESULT, JSON.stringify(items));
        } else {
            let items: Array<Result> = [];
            items.push(result);
            appSettings.setString(RESULT, JSON.stringify(items));
        }
    }

    resetExamStats(): void {
        appSettings.remove(RESULT);
    }
}