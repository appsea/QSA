import {EventData, Observable} from "data/observable";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {topmost} from "ui/frame";
import {NavigatedData, Page} from 'ui/page';
import * as navigationModule from '../shared/navigation';
import {AndroidActivityBackPressedEventData, AndroidApplication} from "application";
import {isAndroid} from "platform";
import {ProgressViewModel} from "./progress-view-model";
import {StackLayout} from "ui/layouts/stack-layout";
import * as Toast from 'nativescript-toast';
import * as dialogs from "ui/dialogs";

var page: Page;
let vm: ProgressViewModel;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    let page = args.object;
    page.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    onDrawerButtonTap(args);
    args.cancel = true;
}

export function pageNavigatingTo(args: NavigatedData): void {
    page = <Page>args.object;
    vm = new ProgressViewModel();
    page.bindingContext = vm;
}

export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}

export function startTest(args: EventData) {
    navigationModule.toPage("question/mock");
}

export function showChart(args: EventData) {
    navigationModule.toPage("stats/chart");
}

export function resetExamStats(): void {
    dialogs.confirm("Are you sure you want to clear your test statistics?").then((proceed) => {
        if (proceed) {
            vm.resetExamStats();
            navigationModule.toPage("stats/progress");
            Toast.makeText("Cleared Exam Stats!!!", "long").show();
        }
    });

}