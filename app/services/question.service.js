"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var settings_service_1 = require("./settings.service");
var firebase = require("nativescript-plugin-firebase");
var dialogs = require("ui/dialogs");
var connection_service_1 = require("../shared/connection.service");
var QuestionService = /** @class */ (function () {
    function QuestionService() {
        this.questions = [];
        this._settingsService = settings_service_1.SettingsService.getInstance();
    }
    QuestionService.getInstance = function () {
        return QuestionService._instance;
    };
    QuestionService.prototype.getNextQuestion = function () {
        return this.getFirebaseQuestion();
    };
    QuestionService.prototype.getRandomNumber = function (max) {
        var randomNumber = Math.floor(Math.random() * (max));
        return randomNumber;
    };
    QuestionService.prototype.getFirebaseQuestion = function () {
        if (this.questions.length != 0) {
            return this.readFromQuestions();
        }
        else {
            if (this._settingsService.hasQuestions()) {
                this.questions = this._settingsService.readQuestions();
                return this.readFromQuestions();
            }
            else {
                if (!connection_service_1.ConnectionService.getInstance().isConnected()) {
                    dialogs.alert("Please connect to internet just once so that we can prepare quality questions for you!!");
                }
                else {
                    this.readAllQuestions();
                }
            }
        }
        return this.getNextQuestionFromCache();
    };
    QuestionService.prototype.readAllQuestions = function () {
        var _this = this;
        this.getQuestions().then(function (questions) {
            _this.questions = questions;
            _this._settingsService.saveQuestions(questions);
        });
    };
    QuestionService.prototype.readFromQuestions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            resolve(_this.questions[_this.getRandomNumber(_this.questions.length)]);
        });
    };
    QuestionService.prototype.getNextQuestionFromCache = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            resolve(QUESTIONS[_this.getRandomNumber(QUESTIONS.length)]);
        });
    };
    QuestionService.prototype.getQuestions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var path = "questions";
            var onValueEvent = function (snapshot) {
                var results = _this.toQuestions(snapshot.value);
                resolve(results);
            };
            firebase.addValueEventListener(onValueEvent, "/" + path);
        }).catch(this.handleErrors);
    };
    QuestionService.prototype.handleErrors = function (error) {
        console.log("error not handled: " + error.body);
        return null;
    };
    QuestionService.prototype.toQuestions = function (data) {
        var questions = [];
        data.forEach(function (raw) {
            questions.push(raw);
        });
        return questions;
    };
    QuestionService._instance = new QuestionService();
    return QuestionService;
}());
exports.QuestionService = QuestionService;
var QUESTIONS = [
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
];
