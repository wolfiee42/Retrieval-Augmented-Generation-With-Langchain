import mongoose from "mongoose";
import { TErrorSource, TGenericErrorResponse } from "../interface/error";

const handleCastError = (err: mongoose.CastError): TGenericErrorResponse => {
    const errorSourse: TErrorSource = [{

        path: err.path,
        message: err.message,

    }]

    const statusCode = 400;

    return {
        statusCode,
        message: "Invalid Id",
        errorSourse,
    }
}

export default handleCastError;