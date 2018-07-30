import {EventData, Observable} from "data/observable";
import {IOption, IQuestion, State} from "../shared/questions.model";
import {QuestionService} from "../services/question.service";
import {SettingsService} from "../services/settings.service";
import {AdService} from "../services/ad.service";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {topmost} from "ui/frame";
import * as dialogs from "ui/dialogs";
import * as navigationModule from '../shared/navigation';
import {QuizUtil} from "../shared/quiz.util";

export class CategoryPracticeViewModel extends Observable {
    private _questionService: QuestionService;
    private _settingsService: SettingsService;

    private _question: IQuestion;
    private _state: State;
    private _questionNumber: number;

    private _mode: string;
    private _numbers: Array<number>;

    constructor(numbers: Array<number>) {
        super();
        this._questionService = QuestionService.getInstance();
        this._questionService.readAllQuestions();
        this._numbers = numbers;
        console.log("Got " + this._numbers.length + " numbers");
        this.next();
    }

    public next(): void {
        let randomNumber:number = QuizUtil.getRandomNumber(this._numbers.length);
        QuestionService.getInstance().getQuestion(this._numbers[randomNumber]).then((que: IQuestion) => {
            this._question = que;
            console.log("Publishing...." + this._question.description);
            this.publish();
        });
    }

    public previous(): void {
        this.goPrevious();
    }

    public goPrevious(){

    }

    flag(): void{
        this._questionService.handleFlagQuestion(this._question);
        this.publish();
    }

    public showDrawer(){
        const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
        sideDrawer.showDrawer();
        AdService.getInstance().hideAd();
    }

    alreadyAsked(newQuestion: IQuestion): boolean {
        let result = this.state.questions.find(question => question.number === newQuestion.number);
        let alreadyAsked = result != null;
        return alreadyAsked;
    }

    quit(): void {
        dialogs.confirm("Are you sure you want to quit?").then((proceed) => {
            if (proceed) {
                AdService.getInstance().showInterstitial();
                this.showResult();
            }
        });
    }

    submit(): void {
        dialogs.confirm("Are you sure you want to submit?").then((proceed) => {
            if (proceed) {
                AdService.getInstance().showInterstitial();
                this.showResult();
            }
        });
    }

    get question() {
        if (!this._question) {
            this._question = {description: '', options: [], explanation: '', show: false}
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
        console.log("publish...");
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
        if (selectedOption.selected) {
            selectedOption.selected = false;
            this.question.skipped = true;
        } else {
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
        QuestionService.getInstance().handleWrongQuestions(this.question);
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