export interface IQuestion {
    number?: string;
    description: string;
    explanation?: string;
    options: Array<IOption>;
    skipped?: boolean;
    show?: boolean;
}

export interface IOption {
    tag: string;
    description: string;
    correct: boolean;
    selected?: boolean;
    show?: boolean;
}

export interface ISetting {
    totalQuestionsQuick: number;
    totalQuestionsMain: number;
    totalQuestionsTick: number;
    totalTime: number;
}

export interface State {
    questionWrapper?: IQuestion;
    questions: Array<IQuestion>;
    questionNumber: number;
    totalQuestions: number;
    mode?: string;
    time?:number;
}


export interface Map {
    value: number;
    status: string;
}