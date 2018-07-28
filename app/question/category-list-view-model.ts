import {EventData, Observable} from "data/observable";
import {Category} from "../shared/questions.model";
import {CategoryService} from "../services/category.service";
import {AdService} from "../services/ad.service";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {topmost} from "ui/frame";

export class CategoryListViewModel extends Observable {
    private _categories: Array<Category>;

    constructor() {
        super();
        this._categories = CategoryService.getInstance().getCategories();
        console.log("Constructor " + this._categories);
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
        let selectedCategory: Category = args.view.bindingContext;
        console.log("SelectedCategory : " + selectedCategory.name);
    }

    public showDrawer(){
        const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
        sideDrawer.showDrawer();
        AdService.getInstance().hideAd();
    }
}