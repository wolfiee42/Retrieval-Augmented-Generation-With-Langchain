import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.join(process.cwd(), '.env') })


export default {
    environment: process.env.NODE_ENVIRONMENT,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    unstructured_api_key: process.env.UNSTRUCTURED_API_KEY,
    hugging_face_access_token: process.env.HUGGING_FACE_ACCESS_TOKEN,
}