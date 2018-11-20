import * as frameModule from "tns-core-modules/ui/frame";
import { State } from "./questions.model";

export function	gotoResultPage(state: State) {
    frameModule.topmost().navigate({
        moduleName: "shared/result/result-page",
        clearHistory: true,
        context: state,
        transition: {
            name: "fade"
        }
    });
}

export function	gotoEditPage(state: State) {
    frameModule.topmost().navigate({
        moduleName: "question/edit-question",
        context: state,
        transition: {
            name: "fade"
        }
    });
}

export function	gotoQuestionMap(state: State) {
    frameModule.topmost().navigate({
        moduleName: "question/map",
        context: state,
        transition: {
            name: "fade"
        }
    });
}

export function	toPage(path: string) {
    frameModule.topmost().navigate({
        moduleName: path,
        transition: {
            name: "fade"
        }
    });
}

export function	gotoDetailsPage(state: State) {
    frameModule.topmost().navigate({
        moduleName: "shared/details/detailed-result",
        context: state,
        transition: {
            name: "fade"
        }
    });
}

export function	goBack() {
    frameModule.topmost().goBack();
}
