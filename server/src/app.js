import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes/user.js';
import cookieParser from 'cookie-parser';
const app = express();
dotenv.config()
app.use(cookieParser())
app.use(express.json());
console.log(process.env.Origin)
app.use(cors(
    {
        credentials:true,
        origin:process.env.Origin
    }
));

app.use('/api/user',router);

app.listen(process.env.port,async()=>{
    console.log("Server is listening on port ",process.env.port);
})