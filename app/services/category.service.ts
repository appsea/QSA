import {Category, IQuestion} from "../shared/questions.model";
import {QuestionUtil} from "./question.util";
import {PersistenceService} from "./persistence.service";
import {HttpService} from "./http.service";

export class CategoryService {

    private _categories: Array<Category>;

    private static _instance: CategoryService = new CategoryService();

    private constructor() {
        this.readCategoriesFromFirebase();
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
                category.attempted.push(+question.number);
                if (QuestionUtil.isWrong(question)) {
                    if (category.wronglyAnswered.indexOf(+question.number) < 0) {
                        category.wronglyAnswered.push(+question.number);
                    }
                } else {
                    category.wronglyAnswered = category.wronglyAnswered.filter(number => number !== +question.number);
                }
            }
        }
        PersistenceService.getInstance().saveCategories(this._categories);
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
            this._categories = categories;
            PersistenceService.getInstance().saveCategories(categories);
        });
    }


}