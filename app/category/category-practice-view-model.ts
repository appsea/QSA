import {EventData, Observable} from "data/observable";
import {IOption, IQuestion, State} from "../shared/questions.model";
import {QuestionService} from "../services/question.service";
import {SettingsService} from "../services/settings.service";
import {AdService} from "../services/ad.service";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {topmost} from "ui/frame";
import {QuizUtil} from "../shared/quiz.util";
import * as navigationModule from '../shared/navigation';
import {CategoryService} from "../services/category.service";

export class CategoryPracticeViewModel extends Observable {
    private _questionService: QuestionService;

    private _question: IQuestion;
    private _questionNumber: number = 0;
    private _cache: Array<IQuestion> = [];

    private _mode: string;
    private _numbers: Array<number>;

    constructor(numbers: Array<number>) {
        super();
        this._questionService = QuestionService.getInstance();
        this._questionService.getFirebaseQuestion().then(que => {});
        this._numbers = numbers;
        this.next();
    }

    public next(): void {
        if (this._cache.length == 0 || this._questionNumber >= this._cache.length) {
            let randomNumber: number = QuizUtil.getRandomNumber(this._numbers.length);
            QuestionService.getInstance().getQuestion(this._numbers[randomNumber]).then((que: IQuestion) => {
                this._questionNumber = this._questionNumber + 1;
                this._question = que;
                this._cache.push(this._question);
                this.publish();
            });
        } else {
            this._questionNumber = this._questionNumber + 1;
            this._question = this._cache[this._questionNumber-1];
            this.publish();
        }
    }

    public previous(): void {
        this.goPrevious();
    }

    public goPrevious() {
        if (this._questionNumber > 1) {
            this._questionNumber = this._questionNumber - 1;
            this._question = this._cache[this._questionNumber - 1];
            this.publish();
        }
    }

    flag(): void {
        this._questionService.handleFlagQuestion(this._question);
        this.publish();
    }

    public showDrawer() {
        const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
        sideDrawer.showDrawer();
        AdService.getInstance().hideAd();
    }

    alreadyAsked(newQuestion: IQuestion): boolean {
        return false;
    }

    get question() {
        if (!this._question) {
            this._question = {description: '', options: [], explanation: '', show: false}
        }
        return this._question;
    }

    get allQuestionsAsked() {
        return false;
    }

    isPractice(): boolean {
        return this._mode === SettingsService.PRACTICE;
    }

    get options() {
        return this._question.options;
    }

    get questionNumber() {
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
            propertyName: 'questionNumber',
            value: this._questionNumber
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: 'options',
            value: this._question.options
        });
    }

    showAnswer(): void {
        this.question.options.forEach(option => option.show = true);
        this.question.show = true;
        CategoryService.getInstance().attemptQuestion(this.question);
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
        QuestionService.getInstance().handleWrongQuestions(this.question);
    }

    public goToEditPage() {
        let state: State = {questions: [this.question], questionNumber: 1, totalQuestions: 1, mode: this._mode};
        navigationModule.gotoEditPage(state);
    }
}