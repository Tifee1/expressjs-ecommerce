import path from 'path'
import express, { Application, Request, Response, NextFunction } from 'express'
import 'express-async-errors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import expressFileUpload from 'express-fileupload'

import errorHandlerMiddleWare from './middleware/error-handler'
import notFound from './middleware/not-found'
import connectDB from './db/connectDB'
import AuthRouter from './routes/AuthRoute'
import UserRouter from './routes/UserRoute'
import ProductRouter from './routes/ProductRoute'
import ReviewRouter from './routes/ReviewRoute'

dotenv.config()

// Boot express
const app: Application = express()
const port = process.env.PORT || 5000

// Application routing
app.use(express.static(path.resolve(__dirname, '../client')))

app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET_KEY))
app.use(expressFileUpload())

app.get('/api/v1', (req, res) => {
  console.log(req.signedCookies.token)
  res.send('Hello')
})

app.use('/api/v1/auth', AuthRouter)
app.use('/api/v1/user', UserRouter)
app.use('/api/v1/product', ProductRouter)
app.use('/api/v1/review', ReviewRouter)

app.use(notFound)
app.use(errorHandlerMiddleWare)

const start = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('No env keys provided in development or production')
    }
    await connectDB(process.env.MONGODB_URI)
    app.listen(port, () => console.log(`Server is listening on port ${port}!`))
  } catch (error) {
    console.log(error)
  }
}
// Start server
start()
