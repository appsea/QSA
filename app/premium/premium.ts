import { AndroidActivityBackPressedEventData, AndroidApplication } from "application";
import * as appSettings from "application-settings";
import * as purchase from "nativescript-purchase";
import { Product } from "nativescript-purchase/product";
import { Transaction, TransactionState } from "nativescript-purchase/transaction";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { isAndroid } from "platform";
import { EventData, Observable } from "tns-core-modules/data/observable";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { topmost } from "tns-core-modules/ui/frame";
import { ItemEventData } from "tns-core-modules/ui/list-view";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { CreateViewEventData } from "tns-core-modules/ui/placeholder";
import { AdService } from "~/services/ad.service";
import * as constantsModule from "../shared/constants";
import * as navigationModule from "../shared/navigation";
import { PremiumModel } from "./premium-model";
import {QuestionViewModel} from "~/question/question-view-model";

let vm: PremiumModel;
let showDialog: boolean = true;
export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    const page = args.object;
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
    vm = new PremiumModel();
    page.bindingContext = vm;

    purchase.on(purchase.transactionUpdatedEvent, (transaction: Transaction) => {
        if (transaction.transactionState === TransactionState.Restored
            || transaction.transactionState === TransactionState.Purchased) {
            appSettings.setBoolean(constantsModule.PREMIUM, true);
            AdService.getInstance().showAd = false;
            if (showDialog) {
                dialogs.alert("Congratulations! You are a premium user now!");
                showDialog = false;
            }
        }
    });
}

export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function pay(data: ItemEventData) {
    console.log("Paying");
    showDialog = true;
    vm.pay();
    console.log("Paying done..");
}

export function onRestoreTap(data: ItemEventData) {
    showDialog = true;
    vm.restorePurchase();
}
