import { AndroidActivityBackPressedEventData, AndroidApplication } from "application";
import * as Toast from "nativescript-toast";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { isAndroid } from "platform";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { CreateViewEventData } from "tns-core-modules/ui/placeholder";
import { QuestionViewModel } from "~/question/question-view-model";
import { SelectedPageService } from "~/shared/selected-page-service";
import { SummaryViewModel } from "~/stats/summary-view-model";
import * as navigationModule from "../shared/navigation";

let vm: SummaryViewModel;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    const page = args.object;
    page.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    navigationModule.toPage("question/practice");
    args.cancel = true;
}

export function onNavigatingTo(args: NavigatedData) {
    /* ***********************************************************
    * The "onNavigatingTo" event handler lets you detect if the user navigated with a back button.
    * Skipping the re-initialization on back navigation means the user will see the
    * page in the same data state that he left it in before navigating.
    *************************************************************/
    const page = <Page>args.object;
    vm = new SummaryViewModel();
    page.bindingContext = vm;
    SelectedPageService.getInstance().updateSelectedPage("stats");
}

export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function topUpRewards(args: EventData) {
    vm.topUpRewards();
}

export function goPremium() {
    vm.goPremium();
}
