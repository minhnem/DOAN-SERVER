import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import userRouter from './src/routers/userRouter'
import dishRouter from './src/routers/dishRouter'

dotenv.config()

const PORT = process.env.PORT
const dbURL = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.ywhsg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const app = express()

app.use(express.json())
app.use(cors())

app.use('/user', userRouter)
app.use('/dish', dishRouter)

const connectDB = async () => {
    try {
        await mongoose.connect(dbURL)
        console.log('connect to db successfully')
    } catch (error) {
        console.log(`can not connect to db ${error}`)
    }
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server is starting at http://localhost:${PORT}`)
    })
}).catch((error) => {
    console.log(error)
})
