import {EventData, Observable} from "data/observable";
import {Category} from "../shared/questions.model";
import {CategoryService} from "../services/category.service";
import {AdService} from "../services/ad.service";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {topmost} from "ui/frame";
import * as dialogs from "ui/dialogs";
import * as navigationModule from '../shared/navigation';

export class CategoryListViewModel extends Observable {
    private _categories: Array<Category>;

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
        let selectedCategory: Category = args.view.bindingContext;
        console.log("SelectedCategory : " + selectedCategory.name);
    }

    public showDrawer(){
        const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
        sideDrawer.showDrawer();
        AdService.getInstance().hideAd();
    }

    popup() {
        dialogs.action({
            message: "Please select for practice",
            cancelButtonText: "Cancel",
            actions: ["All Questions", "Unanswered", "Incorrectly Answered", "Incorrect and unanswered"]
        }).then((result) => {
            if (result == "All Questions") {
                console.log("The user selected All Questions.");
                navigationModule.gotoCategoryPractice(this._categories[0].questionNumbers);
            } else if (result == "Unanswered") {
                console.log("The user selected Unanswered.");
            } else if (result == "Incorrectly Answered") {
                console.log("The user selected Incorrectly Answered.");
            } else if (result == "Incorrect and unanswered") {
                console.log("The user Incorrect and unanswered.");
            }
        });
    }
}