import {EventData, Observable} from "tns-core-modules/data/observable";
import {State} from "../shared/questions.model";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {topmost} from "ui/frame";
import * as navigationModule from '../shared/navigation';
import {NavigatedData, Page} from 'ui/page';
import {AndroidActivityBackPressedEventData, AndroidApplication} from "application";
import {isAndroid} from "platform";
import {MapViewModel} from "./map-view-model";
import {GridItemEventData} from "nativescript-grid-view";

var page: Page;
var state: State;
let vm: MapViewModel;

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
    state = <State> page.navigationContext;
    vm = new MapViewModel(state);
    page.bindingContext = vm;
}

export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}

export function gridViewItemTap(args: GridItemEventData) {
    vm.gridViewItemTap(args);
}

export function all() {
    vm.all();
}

export function answered() {
    vm.answered();
}

export function skipped() {
    vm.skipped();
}

export function tbd() {
    vm.tbd();
}