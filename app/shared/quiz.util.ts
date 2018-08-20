export class QuizUtil {

    private constructor(){}

    static getDate() {
        var d = new Date();
        return d.toISOString();
    }

    static getRandomNumber(max: number): number {
        const randomNumber = Math.floor(Math.random() * (max));
        return randomNumber;
    }
}