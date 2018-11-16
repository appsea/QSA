import {EventData, Observable} from "tns-core-modules/data/observable";
import {isAndroid} from "platform";
import {android, AndroidActivityBackPressedEventData, AndroidApplication} from "application";
import * as navigationModule from '../shared/navigation';
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {topmost} from "tns-core-modules/ui/frame";
import {EditQuestionViewModel} from "./edit-question-model";
import {State} from "../shared/questions.model";
import {Repeater} from 'tns-core-modules/ui/repeater';

let vm: EditQuestionViewModel;
let state: State;
let optionList: Repeater;

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
export function onNavigatingTo(args: NavigatedData) {
    /* ***********************************************************
    * The "onNavigatingTo" event handler lets you detect if the user navigated with a back button.
    * Skipping the re-initialization on back navigation means the user will see the
    * page in the same data state that he left it in before navigating.
    *************************************************************/
    const page = <Page>args.object;
    optionList = page.getViewById("optionList")
    state = <State> page.navigationContext;
    vm = new EditQuestionViewModel(state);
    page.bindingContext = vm;
}

export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}

export function save(): void {
    vm.save();
    navigationModule.goBack()
}

export function cancel(): void {
    navigationModule.goBack()
}

export function selectOption(args): void {
    vm.selectOption(args);
    optionList.refresh();
}