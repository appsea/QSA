export class QuizUtil {

    private constructor() {
    }

    static days: Array<String> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    static months: Array<String> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    static getDate() {
        var d = new Date();
        return d.toISOString();
    }

    static getDateString(date: Date): string {
        let dateString: string = "";
        dateString += QuizUtil.days[date.getDay()];
        dateString += " " + QuizUtil.months[date.getMonth()];
        dateString += " " + date.getDate();
        //dateString += " " + date.getFullYear().toString().substr(2,2);
        dateString += ", " + date.getHours();
        let minutes: number = date.getMinutes();
        dateString += ":" + (minutes < 10 ? "0" + minutes : minutes);
        return dateString;
    }
}