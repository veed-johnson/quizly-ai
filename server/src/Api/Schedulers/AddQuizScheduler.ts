import { IQuizFeatures } from "../../Application/Contracts/Features/QuizModule/IQuizFeatures";
import { infrastructureClientFactory } from "../Factories/InfrastructureClientFactory";
import { IScheduler } from "../../Application/Contracts/Schedulers/IScheduler";
import { applicationFeatureFactory } from "../Factories/ApplicationFeatureFactory";
import { IMailService } from "../../Application/Contracts/Services/ChatModule/IMailService";

export class GenerateQuizScheduler{

    private readonly _ischeduler: IScheduler;
    private readonly _quizFeatures: IQuizFeatures;
    private readonly _mailService: IMailService
    public constructor(ischeduler: IScheduler, quizFeatures: IQuizFeatures, mailService: IMailService){
        this._ischeduler = ischeduler;
        this._quizFeatures = quizFeatures;
        this._mailService = mailService;
    }
    private addQuizzes = async () => {
        const sentMail = await this._mailService.sendMail("atumasaake@gmail.com", "Test", "Testing this body")
        console.log({sentMail});
        let totalQuizItemsToAdd = 7;
        console.log(`##### adding quizzes of size`)
        await this._quizFeatures.AddNewQuizzes(totalQuizItemsToAdd);
        console.log("##### end of adding quizzes")
    }

    addNewQuizzes = () => {
        this._ischeduler.Execute("addNewQuizzes", '*/1 * * * *', this.addQuizzes, (ex) => console.log(ex));
    }
}

export const generateQuizScheduler = new GenerateQuizScheduler(infrastructureClientFactory.Scheduler(), applicationFeatureFactory.QuizFeatures(), infrastructureClientFactory.MailService());

