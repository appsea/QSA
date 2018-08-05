/**
 * Created by rakesh on 15-Nov-2017.
 */
import {Category, IQuestion} from "../shared/questions.model";
import * as constantsModule from '../shared/constants';
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

    readCategories(): Array<Category> {
        let categories: Array<Category>;
        try {
            var key = constantsModule.CATEGORIES;
            categories = appSettings.hasKey(key) ? JSON.parse(appSettings.getString(key)) : [];
        } catch (error) {
            categories = [];
        }
        return categories;
    }

    hasCategories(): boolean {
        return appSettings.hasKey(constantsModule.CATEGORIES);
    }

    saveCategories(categories: Array<Category>) {
        appSettings.setString(constantsModule.CATEGORIES, JSON.stringify(categories));
    }

}