import mongoose from "mongoose";
import { TErrorSource, TGenericErrorResponse } from "../interface/error";

const handlerValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {
    const errorSourse: TErrorSource = Object.values(err.errors).map((val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
        return {
            path: val?.path,
            message: val?.message
        }
    })

    const statusCode = 400;

    return {
        statusCode,
        message: "Mongoose validation error",
        errorSourse,
    }
}

export default handlerValidationError;