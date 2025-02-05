import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { TErrorSource } from "../interface/error";
import configaration from "../configaration";
import handleZodError from "../errors/handleZodError";
import handlerValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {

    // setting default value
    let statusCode = 500;
    let message = "Something went wrong";


    let errorSourse: TErrorSource = [
        {
            path: "",
            message: ""
        }
    ]


    if (err instanceof ZodError) {

        const simplifiedError = handleZodError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSourse = simplifiedError.errorSourse

    } else if (err.name === "ValidationError") {

        const simplifiedError = handlerValidationError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSourse = simplifiedError.errorSourse;

    } else if (err.name === 'CastError') {

        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSourse = simplifiedError.errorSourse;

    } else if (err.code === 11000) {

        const simplifiedError = handleDuplicateError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSourse = simplifiedError.errorSourse;


    } else if (err instanceof AppError) {

        statusCode = err.statusCode;
        message = err.message;
        errorSourse = [
            {
                path: "",
                message: err.message
            }
        ];

    } else if (err instanceof Error) {

        message = err.message;
        errorSourse = [
            {
                path: "",
                message: err.message
            }
        ];

    }

    // ultimate error handler
    return res.status(statusCode).json({

        success: false,
        message,
        errorSourse,
        stack: configaration.environment === 'development' ? err.stack : null

    })
}

export default globalErrorHandler; 