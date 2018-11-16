import {AdService} from "../services/ad.service";
import {CreateViewEventData} from "ui/placeholder";
import {EventData, Observable} from "tns-core-modules/data/observable";
import {ItemEventData} from "ui/list-view";
import {NavigatedData, Page} from "ui/page";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {topmost} from "ui/frame";
import {AndroidActivityBackPressedEventData, AndroidApplication} from "application";
import {isAndroid} from "platform";
import {PremiumModel} from "./premium-model";
import {Product} from "nativescript-purchase/product";
import {Transaction, TransactionState} from "nativescript-purchase/transaction";
import * as navigationModule from '../shared/navigation';
import * as purchase from "nativescript-purchase";
import * as appSettings from 'application-settings';
import * as constantsModule from '../shared/constants';
import * as dialogs from "ui/dialogs";

let vm: PremiumModel;
let showDialog: boolean = true;
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
    vm = new PremiumModel();
    page.bindingContext = vm;

    purchase.on(purchase.transactionUpdatedEvent, (transaction: Transaction) => {
        if (transaction.transactionState === TransactionState.Restored || transaction.transactionState === TransactionState.Purchased) {
            appSettings.setBoolean(constantsModule.PREMIUM, true);
            AdService.getInstance().showAd = false;
            if(showDialog){
                dialogs.alert("Congratulations! You are a premium user now!");
                showDialog = false;
            }
        }
    });
}

export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}

export function pay(data: ItemEventData) {
    showDialog = true;
    vm.pay();
}

export function onRestoreTap(data: ItemEventData) {
    showDialog = true;
    vm.restorePurchase();
}