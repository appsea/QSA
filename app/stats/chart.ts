import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {EventData} from "tns-core-modules/data/observable";
import {ChartViewModel} from "./chart-view-model";
import {topmost} from "tns-core-modules/ui/frame";

export function onPageLoaded(args) {
    const page = args.object;
    page.bindingContext = new ChartViewModel();
}

export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}
