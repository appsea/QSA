/**
 * Created by rakesh on 15-Nov-2017.
 */
import {IQuestion} from "../shared/questions.model";
import {SettingsService} from "./settings.service";
import {Observable} from "rxjs/Observable";
import {ConnectionService} from "../shared/connection.service";
import {HttpService} from "./http.service";
import {QuizUtil} from "../shared/quiz.util";
import {PersistenceService} from "./persistence.service";
import {QuestionUtil} from "./question.util";
import * as dialogs from "ui/dialogs";
import * as constantsModule from '../shared/constants';
import * as appVersion from "nativescript-appversion";
import * as utils from "utils/utils";
import * as Toast from 'nativescript-toast';

export class QuestionService {

    static getInstance(): QuestionService {
        return QuestionService._instance;
    }

    private static _instance: QuestionService = new QuestionService();

    private questions: Array<IQuestion> = [];
    private _settingsService: SettingsService;
    private _checked: boolean;

    constructor() {
        this._settingsService = SettingsService.getInstance();
        this._checked = false;
    }

    getNextQuestion(): Promise<IQuestion> {
        return this.getFirebaseQuestion();
    }

    handleWrongQuestions(question: IQuestion) {
        let wrongQuestions: Array<IQuestion> = PersistenceService.getInstance().readWrongQuestions();
        if (QuestionUtil.isWrong(question)) {
            this.add(constantsModule.WRONG_QUESTION, question, wrongQuestions);
        } else {
            this.remove(constantsModule.WRONG_QUESTION, question, wrongQuestions);
        }
    }

    handleFlagQuestion(question: IQuestion) {
        let flaggedQuestions: Array<IQuestion> = PersistenceService.getInstance().readFlaggedQuestions();
        if (!this.containsQuestion(question, flaggedQuestions)) {
            Toast.makeText("Added to flagged questions.", "long").show();
            question.flagged = true;
            flaggedQuestions.push(question);
            PersistenceService.getInstance().addQuestions(constantsModule.FLAG_QUESTION, flaggedQuestions);
        } else {
            question.flagged = false;
            this.remove(constantsModule.FLAG_QUESTION, question, flaggedQuestions);
            Toast.makeText("Question is removed from flagged.", "long").show();
        }
    }

    public add(key: string, question: IQuestion, questions: Array<IQuestion>) {
        if (!this.containsQuestion(question, questions)) {
            questions.push(question);
            PersistenceService.getInstance().addQuestions(key, questions);
        }
    }

    public remove(key: string, question: IQuestion, questions: Array<IQuestion>) {
        let filteredRecords: Array<IQuestion> = questions.filter(item => item.number !== question.number);
        PersistenceService.getInstance().addQuestions(key, filteredRecords);
    }

    private containsQuestion(search: IQuestion, questions: Array<IQuestion>): boolean {
        let contains = false;
        questions.forEach(question => {
            if (question.number === search.number) {
                contains = true;
            }
        });
        return contains;
    }

    public update(question: IQuestion) {
        let url = constantsModule.FIREBASE_URL + "suggestions.json";
        var questionWithDate = {question: question, date: QuizUtil.getDate()};
        HttpService.getInstance().httpPost(url, questionWithDate);
    }

    getFirebaseQuestion(): Promise<IQuestion> {
        this.checkQuestionUpdate();
        if (this.questions.length != 0) {
            return this.readFromQuestions();
        } else {
            if (this._settingsService.hasQuestions()) {
                this.questions = this._settingsService.readQuestions();
                return this.readFromQuestions();
            } else {
                if (!ConnectionService.getInstance().isConnected()) {
                    dialogs.alert("Please connect to internet so that we can prepare quality questions for you!!");
                } else {
                    this.readAllQuestions();
                }
            }
        }
        return this.getNextQuestionFromCache();
    }

    private getRandomNumber(max: number): number {
        const randomNumber = Math.floor(Math.random() * (max));
        return randomNumber;
    }

    private readAllQuestions(): void {
        HttpService.getInstance().getQuestions<Array<IQuestion>>().then((questions: Array<IQuestion>) => {
            this.questions = questions;
            this._settingsService.saveQuestions(questions);
        });
    }

    private checkQuestionUpdate(): void {
        if (!this._checked) {
            HttpService.getInstance().findLatestQuestionVersion().then((latestQuestionVersion: string) => {
                if (this._settingsService.readQuestionVersion() < Number(latestQuestionVersion)) {
                    this.readAllQuestions();
                    this._settingsService.saveQuestionVersion(Number(latestQuestionVersion));
                }
            });
            this.checkUpdates();
            this._checked = true;
        }
    }

    private readFromQuestions(): Promise<IQuestion> {
        return new Promise<IQuestion>((resolve, reject) => {
            let randomNumber = this.getRandomNumber(this.questions.length);
            let question = this.questions[randomNumber];
            question.flagged = this.isFlagged(question);
            resolve(question);
        });
    }

    private getNextQuestionFromCache(): Promise<IQuestion> {
        return new Promise<IQuestion>((resolve, reject) => {
            resolve(QUESTIONS[this.getRandomNumber(QUESTIONS.length)]);
        });
    }

    private checkUpdates() {
        if (!this._checked) {
            HttpService.getInstance().checkPlayStoreVersion().then((playStoreVersion: string) => {
                appVersion.getVersionCode().then((appVersion: string) => {
                    if (Number(playStoreVersion) > Number(appVersion)) {
                        dialogs.confirm({
                            title: "Notification",
                            message: "A latest version of Base Sas is now available on play store.",
                            okButtonText: "Upgrade",
                            cancelButtonText: "Remind me Later"
                        }).then(proceed => {
                            if (proceed) {
                                utils.openUrl("https://play.google.com/store/apps/details?id=com.exuberant.advanced.sas");
                            }
                        });
                    }
                });
            });
        }

    }

    public isFlagged(question: IQuestion): boolean {
        return this.containsQuestion(question, PersistenceService.getInstance().readFlaggedQuestions());
    }
}

const QUESTIONS: Array<IQuestion> = [
    {
        "description": "Why PROC FSLIST is used?",
        "explanation": "The FSLIST procedure enables you to browse external files that are not SAS data sets within a SAS session. Because the files are displayed in an interactive window, the procedure provides a highly convenient mechanism for examining file contents.",
        "number": "-1",
        "options": [{
            "correct": false,
            "description": "A. to write to an external file",
            "tag": "A"
        }, {
            "correct": true,
            "description": "B. to read from an external file",
            "tag": "B"
        }, {
            "correct": false,
            "description": "C. to sort by date",
            "tag": "C"
        }, {
            "correct": false,
            "description": "D. not a valid statement",
            "tag": "D"
        }]
    }
]