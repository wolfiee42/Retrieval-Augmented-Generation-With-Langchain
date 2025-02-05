import { NextFunction, Request, RequestHandler, Response } from "express"


// a global func for trycatch. using this func, i dont have to write tryCatch over and over again.
const catchAsync = (fn: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err))
    }
}

export default catchAsync;