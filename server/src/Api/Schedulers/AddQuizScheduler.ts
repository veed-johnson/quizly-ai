import { IQuizFeatures } from "../../Application/Contracts/Features/QuizModule/IQuizFeatures";
import { infrastructureClientFactory } from "../Factories/InfrastructureClientFactory";
import { IScheduler } from "../../Application/Contracts/Schedulers/IScheduler";
import { applicationFeatureFactory } from "../Factories/ApplicationFeatureFactory";
import { IMailService } from "../../Application/Contracts/Services/ChatModule/IMailService";
import { IUserFeatures } from "../../Application/Contracts/Features/AuthenticationModule/IUserFeatures";

export class GenerateQuizScheduler{

    private readonly _iScheduler: IScheduler;
    private readonly _quizFeatures: IQuizFeatures;
    private readonly _mailService: IMailService;
    private readonly _userFeatures: IUserFeatures;
    public constructor(ischeduler: IScheduler, quizFeatures: IQuizFeatures, mailService: IMailService, userFeature: IUserFeatures){
        this._iScheduler = ischeduler;
        this._quizFeatures = quizFeatures;
        this._mailService = mailService;
        this._userFeatures = userFeature;
    }
    private mailAdminUsers = async (title: string, message: string) => {
        const allAdminUsers = await this._userFeatures.GetAllAdminUsers();
        const adminUserEmails: string[] = allAdminUsers.map(user => user.email);
        if(adminUserEmails.length > 0){
            await this._mailService.sendMailToMultipleRecipients(adminUserEmails, title, message);
        }
            
    }

    private addQuizzes = async () => {
        
        try{
            const categories: string = "sports, music, history, geography, movies, and science"
            const totalQuizItemsToAdd = 1;
            console.log(`##### adding quizzes of size`)
            await this._quizFeatures.AddNewQuizzes(totalQuizItemsToAdd, categories);
            console.log("##### end of adding quizzes")
            await this.mailAdminUsers("Successfully added new quizzes", `Total number of new quizzes added ${totalQuizItemsToAdd}`)
            
        }
        catch(ex){
            const exceptionMessage = `An exception occurred while adding quiz: Exception ${JSON.stringify(ex)}`;
            await this.mailAdminUsers("Failed to added new quizzes", exceptionMessage);
        }
    }

    addNewQuizzes = () => {
        this._iScheduler.Execute("addNewQuizzes", '*/1 * * * *', this.addQuizzes, (ex) => console.log(ex));
    }
}

export const generateQuizScheduler = new GenerateQuizScheduler(infrastructureClientFactory.Scheduler(), applicationFeatureFactory.QuizFeatures(), infrastructureClientFactory.MailService(), applicationFeatureFactory.UserFeatures());

