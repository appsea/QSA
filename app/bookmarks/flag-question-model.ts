import {EventData, Observable} from "tns-core-modules/data/observable";
import {BookmarkQuestionModel} from "./bookmark-question-model";
import {PersistenceService} from "../services/persistence.service";

export class FlagQuestionModel extends BookmarkQuestionModel {
    private static message: string = "No more flagged questions. Click Ok to go to practice.";

    constructor() {
        super(PersistenceService.getInstance().readFlaggedQuestions(), "flag");
        super.next(FlagQuestionModel.message);
    }

    next(): void {
        super.next(FlagQuestionModel.message);
    }
}