import { AndroidActivityBackPressedEventData, AndroidApplication } from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { isAndroid, screen } from "platform";
import { EventData, Observable } from "tns-core-modules/data/observable";
import * as ButtonModule from "tns-core-modules/ui/button";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { topmost } from "tns-core-modules/ui/frame";
import { Label } from "tns-core-modules/ui/label";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { CreateViewEventData } from "tns-core-modules/ui/placeholder";
import { Repeater } from "tns-core-modules/ui/repeater";
import { ScrollView } from "tns-core-modules/ui/scroll-view";
import { TextView } from "tns-core-modules/ui/text-view";
import { AdService } from "../services/ad.service";
import { SettingsService } from "../services/settings.service";
import { ConnectionService } from "../shared/connection.service";
import * as constantsModule from "../shared/constants";
import { QuestionViewModel } from "./question-view-model";

let vm: QuestionViewModel;
let optionList: Repeater;
let suggestionButton: ButtonModule.Button;
let defaultExplanation: Label;
let explanationHeader: Label;
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
export function onNavigatingTo(args) {
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
    banner = page.getViewById("banner");
    suggestionButton = page.getViewById("suggestionButton");
    if (!SettingsService.route()) {
        _page = page;
        optionList = page.getViewById("optionList");
        scrollView = page.getViewById("scrollView");
        vm = new QuestionViewModel(constantsModule.PRACTICE);
        page.bindingContext = vm;
    } else {
        explanationHeader = page.getViewById("explanationHeader");
        defaultExplanation = page.getViewById("defaultExplanation");
        explanationHeader.visibility = "hidden";
        defaultExplanation.visibility = "hidden";
        suggestionButton.visibility = "hidden";
    }
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
    QuestionViewModel.showDrawer();
}

export function handleSwipe(args) {
    if (args.direction === 1) {
        previous();
    } else if (args.direction === 2) {
        next();
    }
}

export function moveToLast() {
    suggestionButton = _page.getViewById("suggestionButton");
    if (suggestionButton && scrollView) {
        const locationRelativeTo = suggestionButton.getLocationRelativeTo(scrollView);
        if (locationRelativeTo) {
            scrollView.scrollToVerticalOffset(locationRelativeTo.y, false);
        }
    }
}

export function goToEditPage(): void {
    vm.goToEditPage();
}

export function previous(): void {
    if (!vm) {
        vm = new QuestionViewModel(constantsModule.PRACTICE);
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
            banner.height = AdService.getInstance().getAdHeight() + "dpi";
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
    optionList.refresh();
    moveToLast();
}

export function selectOption(args): void {
    if (!vm.enableSelection()) {
        vm.showAnswer();
        vm.selectOption(args);
        optionList.refresh();
        moveToLast();
    }
}

export function creatingView(args: CreateViewEventData) {
}
