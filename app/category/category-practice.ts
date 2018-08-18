import {CreateViewEventData} from "ui/placeholder";
import {EventData, Observable} from "data/observable";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {topmost} from "ui/frame";
import {NavigatedData, Page} from "ui/page";
import {ScrollView} from "tns-core-modules/ui/scroll-view";
import * as ButtonModule from "tns-core-modules/ui/button";
import {TextView} from "ui/text-view";
import {AndroidActivityBackPressedEventData, AndroidApplication} from "application";
import {isAndroid, screen} from "platform";
import {Repeater} from 'ui/repeater';
import {Label} from 'ui/label';
import * as dialogs from "ui/dialogs";
import {AdService} from "../services/ad.service";
import {ConnectionService} from "../shared/connection.service";
import {CategoryPracticeViewModel} from "./category-practice-view-model";

let vm: CategoryPracticeViewModel;
let optionList: Repeater;
let suggestionButton: ButtonModule.Button;
let defaultExplanation: Label;
let explanationHeader: Label;
var numbers: Array<number>;
let _page: any;
let scrollView: ScrollView;
let banner: any;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    resetBanner();
}

export function resetBanner() {
    if (banner) {
        banner.height = "0";
    }
}

/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize the page binding context.
*************************************************************/
export function onNavigatingTo(args: NavigatedData): void {
    if (args.isBackNavigation) {
        return;
    }
    _page = <Page>args.object;
    numbers = <Array<number>> _page.navigationContext;
    optionList = _page.getViewById("optionList");
    scrollView = _page.getViewById("scrollView");
    banner = _page.getViewById("banner");
    vm = new CategoryPracticeViewModel(numbers);
    _page.bindingContext = vm;
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    previous();
    args.cancel = true;
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

export function moveToLast() {
    suggestionButton = _page.getViewById("suggestionButton");
    if (suggestionButton) {
        let locationRelativeTo = suggestionButton.getLocationRelativeTo(scrollView);
        if (scrollView && locationRelativeTo) {
            scrollView.scrollToVerticalOffset(locationRelativeTo.y, false);
        }
    }
}

export function goToEditPage(): void {
    vm.goToEditPage();
}

export function previous(): void {
    if (!vm) {
        vm = new CategoryPracticeViewModel([]);
    }
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

export function showAnswer(): void {
    vm.showAnswer();
    optionList.refresh();
    moveToLast();
}

export function selectOption(args): void {
    vm.showAnswer();
    vm.selectOption(args);
    optionList.refresh();
    moveToLast();
}

export function creatingView(args: CreateViewEventData) {
}