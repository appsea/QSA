/**
 * Created by rakesh on 15-Nov-2017.
 */
import {IQuestion, Result, State} from "../shared/questions.model";
import * as constantsModule from '../shared/constants';
import * as appSettings from 'application-settings';
import {Observable} from "rxjs/Observable";
import {QuestionUtil} from "./question.util";
import {RESULT} from "../shared/constants";
import {QuizUtil} from "../shared/quiz.util";

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
        //items = [];
        return items;
    }

    saveResult(state: State): void {
        let result = this.calculateResult(state);
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

    calculateResult(state: State): Result {
        let correct: number = 0;
        let wrong: number = 0;
        let skipped: number = 0;
        let total: number = state.questions.length;
        for (const question of state.questions) {
            if (QuestionUtil.isCorrect(question)) {
                correct = correct + 1;
            } else if (QuestionUtil.isSkipped(question)) {
                skipped = skipped + 1;
            } else {
                wrong = wrong + 1;
            }
        }
        let percentage = (correct * 100 / state.questions.length);
        let percentageString: string = percentage.toFixed(2);
        let result: Result = {
            date: QuizUtil.getDateString(new Date()),
            correct: correct,
            wrong: wrong,
            skipped: skipped,
            total: total,
            percentage: percentageString + '%',
            pass: percentage > constantsModule.PASSING_PERCENTAGE
        };
        return result;
    }

    resetExamStats(): void {
        appSettings.remove(RESULT);
    }
}