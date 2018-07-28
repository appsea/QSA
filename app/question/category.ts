import {CreateViewEventData} from "ui/placeholder";
import {EventData, Observable} from "data/observable";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {topmost} from "ui/frame";
import {NavigatedData, Page} from "ui/page";
import {ScrollView} from "tns-core-modules/ui/scroll-view";
import {TextView} from "ui/text-view";
import {AndroidActivityBackPressedEventData, AndroidApplication} from "application";
import {isAndroid, screen} from "platform";
import {Repeater} from 'ui/repeater';
import {Label} from 'ui/label';
import {CategoryListViewModel} from "./category-list-view-model";

let vm: CategoryListViewModel;
let _page: any;
let banner: any;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    resetBanner();
}

export function resetBanner(){
    if (banner) {
        banner.height = "0";
    }
}

/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize the page binding context.
*************************************************************/
export function onNavigatingTo(args: NavigatedData) {
    /* ***********************************************************
    * The "onNavigatingTo" event handler lets you detect if the user navigated with a back button.
    * Skipping the re-initialization on back navigation means the user will see the
    * page in the same data state that he left it in before navigating.
    *************************************************************/

    if (args.isBackNavigation) {
        return;
    }
    const page = <Page>args.object;
    page.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
    _page = page;
    vm = new CategoryListViewModel();
    page.bindingContext = vm;
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    args.cancel = true;
}

/* ***********************************************************
* According to guidelines, if you have a drawer on your page, you should always
* have a button that opens it. Get a reference to the RadSideDrawer view and
* use the showDrawer() function to open the app drawer section.
*************************************************************/
export function onDrawerButtonTap(args: EventData) {
    //resetBanner();
    vm.showDrawer();
}

export function goToEditPage(): void {
    //vm.goToEditPage();
}

export function selectCategory(args): void {
    vm.selectCategory(args);
}

export function creatingView(args: CreateViewEventData) {
}