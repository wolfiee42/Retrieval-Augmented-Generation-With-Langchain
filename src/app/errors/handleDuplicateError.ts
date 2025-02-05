import { TErrorSource } from "../interface/error";

const handleDuplicateError = (err: any) => {

    const regex = /"([^"]*)"/;
    const match = err.message.match(regex);
    const extractedMessage = match && match[1]

    const errorSourse: TErrorSource = [
        {
            path: '',
            message: `${extractedMessage} is already exist.`

        }
    ]

    const statusCode = 400;

    return {
        statusCode,
        message: "Duplicate Error",
        errorSourse,
    }
}

export default handleDuplicateError;