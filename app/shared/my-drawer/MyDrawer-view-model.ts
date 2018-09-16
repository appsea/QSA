import {Observable} from "data/observable";
import * as appVersion from "nativescript-appversion";

import {ObservableProperty} from "../../shared/observable-property-decorator";

/* ***********************************************************
* Keep data that is displayed in your app drawer in the MyDrawer custom component view model.
*************************************************************/
export class MyDrawerViewModel extends Observable {
    @ObservableProperty() selectedPage: string;
    @ObservableProperty() version: string;

    /* ***********************************************************
    * Use the MyDrawer view model constructor to initialize the properties data values.
    *************************************************************/
    constructor(selectedPage: string) {
        super();

        this.selectedPage = selectedPage;
        this.findVersion();
    }

    public findVersion() {
        appVersion.getVersionName().then((version: string) => {
            this.version = 'v ' + version;
        });
    }
}
