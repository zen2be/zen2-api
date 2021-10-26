// imports npm packages
import 'reflect-metadata'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import { createConnection, createConnections } from 'typeorm'
import dotenv from 'dotenv'

// import custom modules
import apiRoutes from './routes/api.router'

// app configuration
dotenv.config()
const app = express()
const url = process.env.APP_URL || 'http://localhost'
const port = process.env.APP_PORT || 3000

// cors configuration
const whitelist = [process.env.FRONTEND_URL]
const corsOptions: any = {
  origin: (origin: string, callback: any) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

// database connection
console.log('[server]: ⌛ Connecting to database...')
createConnection()
  .then((connection) => {
    console.log('[server]: 🔌 Connected to database')

    // middleware
    app.use(helmet())
    // app.use(cors(corsOptions)) TODO: uncomment when deploy
    app.use(morgan('dev'))
    app.use(express.json())

    // routes
    app.use(apiRoutes)

    // run
    app.listen(port, () => console.log(`[server]: ⚡ Running on ${url}:${port}`))
  })
  .catch((err) => {
    console.log(err)
  })
