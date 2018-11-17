import {EventData, Observable} from "tns-core-modules/data/observable";
import {State} from "../questions.model";
import {NavigatedData, Page} from 'tns-core-modules/ui/page';
import {DetailedResultViewModel} from "./detailed-result-view-model";
import {AndroidActivityBackPressedEventData, AndroidApplication} from "application";
import {isAndroid} from "platform";
import * as navigationModule from '../navigation';
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {topmost} from "tns-core-modules/ui/frame";
import * as ListView from "tns-core-modules/ui/list-view";

var page: Page;
let vm: DetailedResultViewModel;
let list: ListView.ListView;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    let page = args.object;
    page.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    navigationModule.goBack();
    args.cancel = true;
}

export function pageNavigatingTo(args: NavigatedData): void {
    page = <Page>args.object;
    list = page.getViewById("listView");
    let state: State = <State> page.navigationContext;
    vm = new DetailedResultViewModel(state);
    page.bindingContext = vm;
}

export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}

export function all(): void {
    vm.all();
    list.scrollToIndex(0);
}

export function correct(): void {
    vm.correct();
    list.scrollToIndex(0);
}

export function incorrect(): void {
    vm.incorrect();
    list.scrollToIndex(0);
}

export function skipped(): void {
    vm.skipped();
    list.scrollToIndex(0);
}