import {EventData, Observable} from "data/observable";
import {Category} from "../shared/questions.model";
import {CategoryService} from "../services/category.service";
import {AdService} from "../services/ad.service";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {topmost} from "ui/frame";
import * as dialogs from "ui/dialogs";
import * as navigationModule from '../shared/navigation';
import {QuestionService} from "../services/question.service";

export class CategoryListViewModel extends Observable {
    private _categories: Array<Category>;

    constructor() {
        super();
        this._categories = CategoryService.getInstance().getCategories();
        this.publish();
    }

    private publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: 'categories',
            value: this._categories
        });
    }

    get categories() {
        return this._categories;
    }

    selectCategory(args: any) {
        args.view.color = "red";
        let selectedCategory = args.view.bindingContext;
        if (selectedCategory.selected) {
            selectedCategory.selected = false;
        } else {
            selectedCategory.selected = true;
        }
        if (this._selectedCategories.indexOf(selectedCategory) > -1) {
            this._selectedCategories = this._selectedCategories.filter(c => c !== selectedCategory);
        } else {
            this._selectedCategories.push(selectedCategory);
        }
    }

    public showDrawer() {
        const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
        sideDrawer.showDrawer();
        AdService.getInstance().hideAd();
    }

    popup() {
        let actions = ["All Questions", "Unanswered"];
        if (this.categories.filter(ca => ca.selected && ca.wronglyAnswered.length > 0).length > 0) {
            actions.push("Incorrect Answered");
        }
        if (this.categories.filter(ca => ca.selected && (ca.wronglyAnswered.length > 0 || ca.questionNumbers.length > ca.attempted.length)).length > 0) {
            actions.push("Incorrect and unanswered");
        }
        dialogs.action({
            message: "Please select for practice",
            cancelButtonText: "Cancel",
            actions: actions
        }).then((result) => {
            if (result == "All Questions") {
                let numbers = [];
                for (let category of this.categories) {
                    if (category.selected) {
                        numbers = numbers.concat(category.questionNumbers);
                    }
                }
                navigationModule.gotoCategoryPractice(numbers);
            } else if (result == "Unanswered") {
                let numbers = [];
                for (let category of this.categories) {
                    if (category.selected) {
                        let unanswered: Array<number> = category.questionNumbers.filter(q => category.attempted.indexOf(q) === -1);
                        numbers = numbers.concat(unanswered);
                    }
                }
                navigationModule.gotoCategoryPractice(numbers);
            } else if (result == "Incorrectly Answered") {
                let numbers = [];
                for (let category of this.categories) {
                    if (category.selected) {
                        numbers = numbers.concat(category.wronglyAnswered);
                    }
                }
                navigationModule.gotoCategoryPractice(numbers);
            } else if (result == "Incorrect and unanswered") {
                let numbers = [];
                for (let category of this.categories) {
                    if (category.selected) {
                        let unanswered: Array<number> = category.questionNumbers.filter(q => category.attempted.indexOf(q) === -1);
                        numbers = numbers.concat(unanswered);
                        numbers = numbers.concat(category.wronglyAnswered);
                    }
                }
                navigationModule.gotoCategoryPractice(numbers);
            }
        });
    }
}