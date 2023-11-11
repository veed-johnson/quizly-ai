import { NextFunction, Request, Response } from "express";

export const ErrorMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    try{
        next()
    }
    catch(ex){
        return response.status(400).json({error: ex})
    }

}