import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {EventData} from "data/observable";
import {ChartViewModel} from "./chart-view-model";
import {topmost} from "ui/frame";

export function onPageLoaded(args) {
    const page = args.object;
    page.bindingContext = new ChartViewModel();
}

export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}
