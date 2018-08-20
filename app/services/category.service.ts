import {Category, IQuestion} from "../shared/questions.model";
import {QuestionUtil} from "./question.util";
import {PersistenceService} from "./persistence.service";
import {HttpService} from "./http.service";

export class CategoryService {

    private _categories: Array<Category> = [];

    private static _instance: CategoryService = new CategoryService();

    private constructor() {
    }

    static getInstance(): CategoryService {
        return CategoryService._instance;
    }

    public getSize(search: string): Number {
        return this.getCategory(search).questionNumbers.length;
    }

    public getCategory(search: string): Category {
        let found: Category[];
        found = this._categories.filter(category => category.name === search);
        return found[0];
    }

    attemptQuestion(question: IQuestion) {
        for (let category of this._categories) {
            if (!category.wronglyAnswered) {
                category.wronglyAnswered = [];
            }
            if (!category.attempted) {
                category.attempted = [];
            }
            if (category.questionNumbers.indexOf(+question.number) > -1) {
                if (category.attempted.indexOf(+question.number) === -1) {
                    category.attempted.push(+question.number);
                }
                if (QuestionUtil.isWrong(question)) {
                    if (category.wronglyAnswered.indexOf(+question.number) < 0) {
                        category.wronglyAnswered.push(+question.number);
                    }
                } else {
                    category.wronglyAnswered = category.wronglyAnswered.filter(number => number !== +question.number);
                }
                category.percentage = ((1 - category.wronglyAnswered.length / category.attempted.length) * 100).toFixed(2);
            }
            PersistenceService.getInstance().saveCategories(this._categories);
        }
    }

    public getCategories(): Array<Category> {
        this._categories = PersistenceService.getInstance().readCategories();
        return this._categories;
    }

    public readCategoriesFromFirebase(): void {
        HttpService.getInstance().getCategories<Array<Category>>().then((categories: Array<Category>) => {
            for (let category of categories) {
                if (!category.wronglyAnswered) {
                    category.wronglyAnswered = [];
                }
                if (!category.attempted) {
                    category.attempted = [];
                }
            }
            this.mergeWithSaved(categories);
        });
    }

    public mergeWithSaved(newCategories: Array<Category>) { // Our mergeWithSaved function
        let existingCategories: Array<Category> = PersistenceService.getInstance().readCategories();
        let merged: Array<Category> = [];
        for (let category of newCategories) {      // for every property in obj1
            if (this.contains(category, existingCategories)) {
                let savedCategory = this.getCategory(category.name);
                savedCategory.questionNumbers = category.questionNumbers;
                savedCategory.percentage = this.calculatePercentage(savedCategory);
                merged.push(savedCategory);
            } else {
                category.percentage = this.calculatePercentage(category);
                merged.push(category);
            }
        }
        this._categories = merged;
        PersistenceService.getInstance().saveCategories(merged);
    }

    public contains(search: Category, categories: Array<Category>): boolean {
        return categories.filter(c => c.name === search.name).length > 0;
    }

    private calculatePercentage(category: Category):string {
        return category.wronglyAnswered.length === 0 ? "0" : (category.wronglyAnswered.length * 100 / category.attempted.length).toFixed(2)
    }
}