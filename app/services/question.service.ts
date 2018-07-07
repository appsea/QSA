/**
 * Created by rakesh on 15-Nov-2017.
 */
import {IQuestion} from "../shared/questions.model";
import {SettingsService} from "./settings.service";
import {Observable} from "rxjs/Observable";
import * as dialogs from "ui/dialogs";
import {ConnectionService} from "../shared/connection.service";
import {HttpService} from "./http.service";
import * as constantsModule from '../shared/constants';
import * as appVersion from "nativescript-appversion";
import * as utils from "utils/utils";

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

    public update(question: IQuestion) {
        let url = constantsModule.FIREBASE_URL + "suggestions.json"
        HttpService.getInstance().httpPost(url, question);
    }

    public error(error: any) {
        let url = constantsModule.FIREBASE_URL + "error.json"
        HttpService.getInstance().httpPost(url, error);
    }

    private getRandomNumber(max: number): number {
        const randomNumber = Math.floor(Math.random() * (max));
        return randomNumber;
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
            resolve(this.questions[randomNumber]);
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
                            message: "A latest version of Base Sas Quiz is now available on play store.",
                            okButtonText: "Upgrade",
                            cancelButtonText: "Remind me Later"
                        }).then(proceed => {
                            if (proceed) {
                                utils.openUrl("https://play.google.com/store/apps/details?id=com.exuberant.quiz.sas");
                            }
                        });
                    }
                });
            });
        }

    }
}

const QUESTIONS: Array<IQuestion> = [
    {
        description: "The following SAS program is submitted:\nfootnote 1 'Sales Report for Last Month';\nfootnote2 'Selected Products Only';\nfootnote3 'All Regions';\nfootnote4 'All Figures in Thousands of Dollars';\nproc print data = sasuser.shoes;\nfootnote2 'All Products';\nrun;\nWhich footnote(s) is/are displayed in the report?\n",
        options: [
            {
                tag: "A",
                description: "A. All Products",
                correct: false
            },
            {
                tag: "B",
                description: "B. Sales Report for Last Month All Products",
                correct: true
            },
            {
                tag: "C",
                description: "C. All Products All Regions All Figures in Thousands of Dollars",
                correct: false
            },
            {
                tag: "D",
                description: "D. Sales Report for Last Month All Products All Regions All Figures in Thousands of Dollars",
                correct: false
            }
        ]
    },
    {
        description: "Given the SAS data set EMPLOYEES:\nEMPLOYEES\nNAME SALARY\n-------- ------------\nInnis 60000\nJolli 50000\nEllis 55000\nLiu 45000\nThe following SAS program is submitted:\nproc print data = employees; where tag like '_i%';\nrun;\nWhat is contained in the output?\n",
        options: [
            {
                tag: "A",
                description: "A. Liu only",
                correct: true
            },
            {
                tag: "B",
                description: "B. Innis and Ellis only",
                correct: false
            },
            {
                tag: "C",
                description: "C. Innis, Ellis, and Liu only",
                correct: false
            },
            {
                tag: "D",
                description: "D. Innis, Jolli, Ellis, and Liu",
                correct: false
            }
        ]
    },
    {
        description: "The SAS data set SASUSER.HOUSES contains a variable PRICE which has been assigned a\npermanent label of \"Asking Price\". Which SAS program temporarily replaces the label \"Asking\nPrice\" with the label \"Sale Price\" in the output?\n",
        options: [
            {
                tag: "A",
                description: "A. proc print data =sasuser.houses; label price = \"Sale Price\"; run;",
                correct: false
            },
            {
                tag: "B",
                description: "B. proc print data =sasuser.houses label; label price \"Sale Price\"; run;",
                correct: false
            },
            {
                tag: "C",
                description: "C. proc print data =sasuser.houses label; label price = \"Sale Price\"; run;",
                correct: true
            },
            {
                tag: "D",
                description: "D. proc print data =sasuser.houses; price = \"Sale Price\"; run;",
                correct: false
            }
        ]
    },
    {
        description: "The following SAS program is submitted:\ndata work.empsalary;\nset work.people (in = inemp)\nwork.money(in = insal);\nif insal and inemp;\nrun;\nThe SAS data set WORKPEOPLE has 5 observations, and the data set WORKMONEY has 7\nobservations. How many observations will the data set WORK.EMPSALARY contain?\n",
        options: [
            {
                tag: "A",
                description: "A. 0",
                correct: true
            },
            {
                tag: "B",
                description: "B. 5",
                correct: false
            },
            {
                tag: "C",
                description: "C. 7",
                correct: false
            },
            {
                tag: "D",
                description: "D. 12",
                correct: false
            }
        ]
    }
]