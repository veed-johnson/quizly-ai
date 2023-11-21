import { UserNotFoundException } from "Application/Common/Exceptions/UserNotFoundException";
import { ErrorModel } from "../../Api/Models/ErrorModel";
import { ValidationException } from "../../Application/Common/Exceptions/ValidationException";
import { NextFunction, Request, Response } from "express";
import { BaseException } from "../../Application/Common/Exceptions/BaseException";

export const ErrorMiddleware = (
    ex: BaseException | Error,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const errorModel = new ErrorModel();
        let errorStatusCode = 400;
        console.log({exceptionName: ex.name})
        switch(ex.name){
            case 'ValidationException':
                var error = ex as ValidationException;
                errorModel.message = error.message;
                errorModel.errors = error.errors;
                break;
            case 'UserNotFoundException':
                var error = ex as UserNotFoundException;
                errorModel.message = error.message;
                errorStatusCode = 404;
                break;
            
            default:
                errorModel.message = ex.message;
                errorModel.errors = {}
        }

        return response.status(errorStatusCode).json(errorModel);
  };