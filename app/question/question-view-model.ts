import * as dialogs from "ui/dialogs";
import {EventData, Observable} from "data/observable";
import {IOption, IQuestion, State} from "../shared/questions.model";
import {QuestionService} from "../services/question.service";
import {SettingsService} from "../services/settings.service";
import * as navigationModule from '../shared/navigation';
import {ObservableArray} from "tns-core-modules/data/observable-array/observable-array";

export class QuestionViewModel extends Observable {
    private _questionService: QuestionService;
    private _settingsService: SettingsService;

    private _question: IQuestion;
    private _state: State;
    private _questionNumber: number;

    private _mode: string;
    private static attempt: boolean;

    constructor(mode: string) {
        super();
        this._questionService = QuestionService.getInstance();
        this._settingsService = SettingsService.getInstance();
        this._state = this._settingsService.readCache(mode);
        this._mode = mode;
        this.showFromState();
    }

    private showFromState(): void {
        if (this._state.questionNumber != 0 && (this._state.questions.length >= this._state.questionNumber || this._state.questionNumber === this._state.totalQuestions)) {
            this._question = this._state.questions[this._state.questionNumber - 1];
        } else {
            this.next();
        }
    }

    public previous(): void {
        if (this._state.questionNumber > 1) {
            this._state.questionNumber = this._state.questionNumber - 1;
            this._question = this._state.questions[this._state.questionNumber - 1];
            this.saveAndPublish(this._mode, this._state);
        }
    }

    next(): void {
        if ((this._state.questionNumber < this._state.totalQuestions) || this.isPractice()) {
            if (this._state.questions.length > 0 && this._state.questions.length > this._state.questionNumber) {
                this._state.questionNumber = this._state.questionNumber + 1;
                this._question = this._state.questions[this._state.questionNumber - 1];
                this.saveAndPublish(this._mode, this._state);
            } else {
                QuestionViewModel.attempt = true;
                this.fetchUniqueQuestion();
            }
        }
    }

    private fetchUniqueQuestion() {
        this._questionService.getNextQuestion().then((que: IQuestion) => {
            if (!this.alreadyAsked(que)) {
                this._state.questionNumber = this._state.questionNumber + 1;
                this._question = que;
                this._state.questions.push(this._question);
                this.saveAndPublish(this._mode, this._state);
                QuestionViewModel.attempt = false;
            } else {
                if (this._settingsService.allQuestionsAsked(this.state.questions.length)) {
                    this.fetchUniqueQuestion();
                } else {
                    dialogs.confirm("Hurray!! You are done practicing all the questions. Click Ok to restart.").then((proceed) => {
                        if (proceed) {
                            SettingsService.getInstance().clearCache(this._mode);
                            navigationModule.toPage("question/practice")
                        }
                    });
                }
            }
        });
    }

    alreadyAsked(newQuestion: IQuestion): boolean {
        let result = this.state.questions.find(question => question.number === newQuestion.number);
        let alreadyAsked = result != null;
        return alreadyAsked;
    }

    quit(): void {
        dialogs.confirm("Are you sure you want to quit?").then((proceed) => {
            if (proceed) {
                this.showResult();
            }
        });
    }

    submit(): void {
        dialogs.confirm("Are you sure you want to submit?").then((proceed) => {
            if (proceed) {
                this.showResult();
            }
        });
    }

    get question() {
        if (!this._question) {
            this._question = {description: '', options: [], explanation: ''}
        }
        return this._question;
    }

    get state() {
        return this._state;
    }

    get allQuestionsAsked() {
        return this._state.questions.length == this._state.totalQuestions;
    }

    isPractice(): boolean {
        return this._mode === SettingsService.PRACTICE;
    }

    get options() {
        return this._question.options;
    }

    get questionNumber() {
        this._questionNumber = this._state.questionNumber;
        return this._questionNumber;
    }

    public publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: 'question',
            value: this._question
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: 'options',
            value: this._question.options
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: 'state',
            value: this._state
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: 'questionNumber',
            value: this._state.questionNumber
        });
    }

    public showResult() {
        this._settingsService.clearCache(this._mode);
        this._state.mode = this._mode;
        navigationModule.gotoResultPage(this._state);
    }

    showAnswer(): void {
        this.question.options.forEach(option => option.show = true);
        this.question.show = true;
        this.publish();
    }

    selectOption(args: any) {
        let selectedOption: IOption = args.view.bindingContext;
        if(selectedOption.selected){
            selectedOption.selected = false;
            this.question.skipped = true;
        }else{
            this.question.options.forEach((item, index) => {
                if (item.tag === selectedOption.tag) {
                    item.selected = true;
                } else {
                    item.selected = false;
                }
            });
            this.question.skipped = false;
        }
        this.saveAndPublish(this._mode, this._state);
    }

    public saveAndPublish(_mode: string, _state: State) {
        this._settingsService.saveCache(this._mode, this._state);
        this.publish();
    }

    public showMap() {
        this._state.mode = this._mode;
        navigationModule.gotoQuestionMap(this._state);
    }

    public goToEditPage() {
        this._state.mode = this._mode;
        navigationModule.gotoEditPage(this._state)
    }
}