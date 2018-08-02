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
    private _selectedCategory: Category;

    constructor() {
        super();
        this._categories = CategoryService.getInstance().getCategories();
        console.log("Constructor " + this._categories);
        this.publish();
    }

    public isSelected(name: string): boolean {
        console.log("Selected "+ name);
        return true;
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
        this._selectedCategory = args.view.bindingContext;
        console.log("SelectedCategory : " + this._selectedCategory.name);
    }

    public showDrawer(){
        const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
        sideDrawer.showDrawer();
        AdService.getInstance().hideAd();
    }

    popup() {
        let actions = ["All Questions", "Unanswered", "Incorrect and unanswered"];
        if(true){
            actions.push("true");
        }
        dialogs.action({
            message: "Please select for practice",
            cancelButtonText: "Cancel",
            actions: actions
        }).then((result) => {
            if (result == "All Questions") {
                console.log("The user selected All Questions.");
                navigationModule.gotoCategoryPractice(this._selectedCategory.questionNumbers);
            } else if (result == "Unanswered") {
                navigationModule.gotoCategoryPractice(this._selectedCategory.questionNumbers);
            } else if (result == "Incorrectly Answered") {
                navigationModule.gotoCategoryPractice(this._selectedCategory.wronglyAnswered);
            } else if (result == "Incorrect and unanswered") {
                navigationModule.gotoCategoryPractice(this._selectedCategory.wronglyAnswered);
            }
        });
    }
}