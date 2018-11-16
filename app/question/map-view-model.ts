import {EventData, Observable} from "tns-core-modules/data/observable";
import {Map, State} from "../shared/questions.model";
import {ObservableArray} from "tns-core-modules/data/observable-array/observable-array";
import {GridItemEventData} from "nativescript-grid-view";
import * as navigationModule from '../shared/navigation';
import {SettingsService} from "../services/settings.service";
import {QuestionUtil} from "../services/question.util";
import * as Toast from 'nativescript-toast';

const ALL: string = "all";
const SKIPPED: string = "skipped";
const TBD: string = "tbd";

export class MapViewModel extends Observable {
    private _state: State;
    public allItems:Array<Map> = [];
    public items:Array<Map> = [];
    private _message: string;

    constructor(state: State) {
        super();
        this._state = state;
        for (let loop = 0; loop < state.totalQuestions; loop++) {
            let status: string = ALL;
            if(state.questions.length > loop){
                if(QuestionUtil.isSkipped(state.questions[loop])){
                    status = SKIPPED;
                }
            }else{
                status = TBD;
            }
            this.allItems.push({value: (loop + 1), status: status});
        }
        this.all();
    }

    private publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: 'items',
            value: this.items
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: 'message',
            value: this._message
        });
    }

    get totalQuestions() {
        return this._state.questions.length;
    }

    get state() {
        return this._state;
    }

    gridViewItemTap(args: GridItemEventData) {
        let item = this.items[args.index];
        if (this.items.length > args.index && this.items[args.index].status != TBD) {
            this.state.questionNumber = item.value;
            SettingsService.getInstance().saveCache(this.state.mode, this.state);
            navigationModule.toPage("question/practice")
        } else{
            Toast.makeText("Question " + item.value + " is yet to be asked." , "short").show();
        }
    }

    get message() {
        return this._message;
    }

    all() {
        this.items = this.allItems;
        this.publish();
    }

    answered() {
        this._message = "Answered";
        this.items = this.allItems.filter(item=> item.status != SKIPPED && item.status != TBD);
        this.publish();
    }

    skipped() {
        this._message = "Skipped";
        this.items = this.allItems.filter(item=> item.status == SKIPPED);
        this.publish();
    }

    tbd() {
        this._message = "remaining";
        this.items = this.allItems.filter(item=> item.status == TBD);
        this.publish();
    }
}