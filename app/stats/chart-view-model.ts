import {EventData, Observable} from "data/observable";
import {PersistenceService} from "../services/persistence.service";
import {Result} from "../shared/questions.model";

export class ChartViewModel extends Observable {

    get readPercentage() {
        let tp = [];
        let results: Array<Result> = PersistenceService.getInstance().getResult();
        results.forEach(result => tp.push({Percentage: +result.percentage.substr(0, result.percentage.length-3)}));
        return tp;
    }
}