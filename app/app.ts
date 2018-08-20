/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as app from 'application';
import {isAndroid} from 'platform';
import * as frame from 'ui/frame';
import * as purchase from "nativescript-purchase";
import {GeneralService} from "./services/general.service";

purchase.init([
    "base.sas.quiz.premium"
]);

if (isAndroid) {
    app.android.on(app.AndroidApplication.activityBackPressedEvent, (args: app.AndroidActivityBackPressedEventData) => {
        const page = frame.topmost().currentPage;
        if (page != null && page.hasListeners(app.AndroidApplication.activityBackPressedEvent)) {
            (<any>args).page = page;
            page.notify(args);
        }
    });
}

var application = require("application");
application.on(application.uncaughtErrorEvent, function (args) {
    if (args.android) {
        GeneralService.getInstance().logError(args.android);
    } else if (args.ios) {
        GeneralService.getInstance().logError(args.ios);
    }
});

app.start({moduleName: 'question/practice'});

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
