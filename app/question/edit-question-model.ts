import * as Toast from "nativescript-toast";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { QuestionService } from "~/services/question.service";
import { IOption, IQuestion, IState } from "~/shared/questions.model";

export class EditQuestionViewModel extends Observable {

    get question() {
        return this._question;
    }

    get state() {
        return this._state;
    }
    private _state: IState;
    private _question: IQuestion;
    private _originalQuestion: string;

    constructor(state: IState) {
        super();
        this._originalQuestion = JSON.stringify(state.questions[state.questionNumber - 1]);
        this._question = JSON.parse(this._originalQuestion);
        this._state = state;
        this.publish();
    }

    save() {
        if (JSON.stringify(this._question) !== this._originalQuestion) {
            QuestionService.getInstance().update(this._question);
            Toast.makeText("Thanks a ton. Your changes will be reviewed and included asap.", "long")
                .show();
        }
    }

    selectOption(args: any) {
        const selectedOption: IOption = args.view.bindingContext;
        if (selectedOption.selected) {
            selectedOption.selected = false;
        } else {
            this.question.options.forEach((item, index) => {
                item.selected = item.tag === selectedOption.tag;
            });
        }
    }

    private publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "question",
            value: this._question
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "state",
            value: this._state
        });
    }
}
