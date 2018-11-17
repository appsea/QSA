import {EventData, Observable} from "tns-core-modules/data/observable";
import {IOption, IQuestion, State} from "../shared/questions.model";
import {QuestionService} from "../services/question.service";
import * as Toast from 'nativescript-toast';

export class EditQuestionViewModel extends Observable {
    private _state: State;
    private _question: IQuestion;
    private _originalQuestion: string;

    constructor(state: State) {
        super();
        this._originalQuestion = JSON.stringify(state.questions[state.questionNumber - 1]);
        this._question = JSON.parse(this._originalQuestion);
        this._state = state;
        this.publish();
    }

    private publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: 'question',
            value: this._question
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: 'state',
            value: this._state
        });
    }

    get question() {
        return this._question;
    }

    get state() {
        return this._state;
    }

    save() {
        if (JSON.stringify(this._question) !== this._originalQuestion) {
            QuestionService.getInstance().update(this._question);
            Toast.makeText("Thanks a ton. Your changes will be reviewed and included asap.", "long").show();
        }
    }

    selectOption(args: any) {
        let selectedOption: IOption = args.view.bindingContext;
        if (selectedOption.selected) {
            selectedOption.selected = false;
        } else {
            this.question.options.forEach((item, index) => {
                if (item.tag === selectedOption.tag) {
                    item.selected = true;
                } else {
                    item.selected = false;
                }
            });
        }
    }
}