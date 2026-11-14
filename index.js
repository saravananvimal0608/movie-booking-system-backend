import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from "./config/DBConnect.js";
import userRouter from './routes/userRoute.js'
import theatreRouter from './routes/theatreRoute.js'
import screenRouter from './routes/screenRoute.js'
import seatRouter from './routes/seatRoute.js'


dotenv.config();
connectDB()
const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json());

const PORT = process.env.PORT || 5000;


app.use("/api/user", userRouter);
app.use("/api/theatre", theatreRouter);
app.use("/api/screen", screenRouter);
app.use("/api/seat", seatRouter);

app.listen(PORT, () => {
    console.log(`app running in port ${PORT}`)
})

app.get('/', (req, res) => {
    res.send('API is running...')
}
)



