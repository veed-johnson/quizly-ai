export class QuestionResponse{
    question: string;
    clue: string;

    public constructor(question: string, clue: string){
        this.question = question;
        this.clue = clue;
    }
}