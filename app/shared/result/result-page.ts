import {EventData, Observable} from "tns-core-modules/data/observable";
import {State} from "../questions.model";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {StackLayout} from "tns-core-modules/ui/layouts/stack-layout";
import {topmost} from "tns-core-modules/ui/frame";
import {NavigatedData, Page} from 'tns-core-modules/ui/page';
import {ResultViewModel} from "./result-view-model";
import {AndroidActivityBackPressedEventData, AndroidApplication} from "application";
import {isAndroid} from "platform";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as navigationModule from '../navigation';

var page: Page;
var state: State;
let vm: ResultViewModel;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    let page = args.object;
    page.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    dialogs.confirm("Do you want to start new exam?").then((proceed) => {
        if (proceed) {
            navigationModule.toPage("question/practice")
        }
    });
    args.cancel = true;
}

export function onNavigatingTo(args: NavigatedData): void {
    if(args.isBackNavigation){
        return;
    }
    page = <Page>args.object;
    state = <State> page.navigationContext;
    vm = new ResultViewModel(state);
    page.bindingContext = vm;
}

export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}

export function detailedResult(): void {
    vm.detailedResult();
}