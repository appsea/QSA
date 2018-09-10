export interface IQuestion {
    number?: string;
    description: string;
    explanation?: string;
    options: Array<IOption>;
    skipped?: boolean;
    flagged?: boolean;
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
    totalQuestionsMock: number;
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

export interface Result {
    itemType?: string;
    date?: string;
    correct: number;
    wrong?: number;
    skipped?: number;
    total: number;
    percentage: string;
    pass: boolean;
}