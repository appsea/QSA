import {EventData} from "data/observable";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {topmost} from "ui/frame";
import {StackLayout} from "ui/layouts/stack-layout";
import {NavigatedData, Page} from "ui/page";

import {QuestionViewModel} from "./question-view-model";
import * as ListView from "ui/list-view";
import * as constantsModule from '../shared/constants';
import {isAndroid} from "platform";
import {android, AndroidActivityBackPressedEventData, AndroidApplication} from "application";
import {SettingsService} from "../services/settings.service";
import {ScrollView} from "tns-core-modules/ui/scroll-view";
import {AdService} from "../services/ad.service";
import {ConnectionService} from "../shared/connection.service";
import * as dialogs from "ui/dialogs";

let vm: QuestionViewModel;
let optionList: ListView.ListView;
let scrollView: ScrollView;
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

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    previous();
    args.cancel = true;
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
    optionList = page.getViewById("optionList");
    scrollView = page.getViewById("scrollView");
    banner = page.getViewById("banner");
    vm = new QuestionViewModel(constantsModule.MAIN);
    page.bindingContext = vm;
}

/* ***********************************************************
* According to guidelines, if you have a drawer on your page, you should always
* have a button that opens it. Get a reference to the RadSideDrawer view and
* use the showDrawer() function to open the app drawer section.
*************************************************************/
export function onDrawerButtonTap(args: EventData) {
    resetBanner();
    vm.showDrawer();
}

export function handleSwipe(args) {
    if (args.direction == 1) {
        previous();
    } else if (args.direction == 2) {
        next();
    }
}

export function showMap(): void {
    vm.showMap();
}

export function previous(): void {
    vm.previous();
    if (scrollView) {
        scrollView.scrollToVerticalOffset(0, false);
    }
}

export function flag(): void {
    vm.flag();
}

export function next(): void {
    if (AdService.getInstance().showAd && !ConnectionService.getInstance().isConnected()) {
        dialogs.alert("Please connect to internet so that we can fetch next question for you!");
    } else {
        vm.next();
        if (AdService.getInstance().showAd) {
            banner.height = AdService.getInstance().getAdHeight() + 'dpi';
            AdService.getInstance().showSmartBanner();
        }
        if (scrollView) {
            scrollView.scrollToVerticalOffset(0, false);
        }
    }
}

export function submit(): void {
    vm.submit();
}

export function quit(): void {
    vm.quit();
}

export function showAnswer(): void {
    vm.showAnswer();
}

export function goToEditPage(): void {
    vm.goToEditPage();
}

export function selectOption(args): void {
    vm.selectOption(args);
    optionList.refresh();
}