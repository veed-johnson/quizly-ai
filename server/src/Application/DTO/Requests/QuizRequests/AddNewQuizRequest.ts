export  class  AddNewQuizRequest{
    public quizSize: number;
    public categories: string;

    public constructor(quizSize: number, categories?: string){
        this.quizSize = quizSize;
        this.categories = categories ? categories : "sports, music, history, geography, movies, and science";
    }
}