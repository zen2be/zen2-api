// imports npm packages
import { User } from './entities/user'
import 'reflect-metadata'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import { ConnectionOptions, createConnection } from 'typeorm'
import dotenv from 'dotenv'
import session, { SessionOptions } from 'express-session'
import passport from 'passport'
import Auth0Strategy from 'passport-auth0'
import rateLimit from 'express-rate-limit'

// import custom modules
import apiRoutes from './routes/api.router'

// app configuration
dotenv.config()
const app = express()
const url = process.env.APP_URL || 'http://localhost'
const port = process.env.APP_PORT || 3000
const APP_ENV = process.env.APP_ENV || 'development'

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

// express-session configuration
const sess: SessionOptions = {
  secret: process.env.SESSION_SECRET || 'bla',
  cookie: {},
  resave: false,
  saveUninitialized: true,
}

// configure passport to use auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN || '',
    clientID: process.env.AUTH0_CLIENT_ID || '',
    clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
    callbackURL: process.env.AUTH0_CALLBACK_URL || '',
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile)
  }
)

// configure typeorm
const ormConfig: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'test',
  entities: ['build/entities/**/*.js'],
  synchronize: APP_ENV === 'production' ? false : true,
}

// configure rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})

if (APP_ENV === 'production') {
  // Use secure cookies in production (requires SSL/TLS)
  if (sess.cookie) {
    sess.cookie.secure = true
  }

  // Uncomment the line below if your application is behind a proxy (like on Heroku)
  // or if you're encountering the error message:
  // "Unable to verify authorization request state"
  // app.set('trust proxy', 1)
}
console.log(`[server]: App environment: ${APP_ENV}`)

// database connection
console.log('[server]: ⌛ Connecting to database...')
createConnection(ormConfig)
  .then((connection) => {
    console.log('[server]: 🔌 Connected to database')

    // middleware
    app.use(helmet())
    if (APP_ENV === 'production') {
      app.use(cors(corsOptions))
      app.use(limiter)
    }
    app.use(morgan('dev'))
    app.use(express.json())
    app.use(session(sess))
    passport.use(strategy)
    app.use(passport.initialize())
    app.use(passport.session())
    // You can use this section to keep a smaller payload
    passport.serializeUser(function (user, done) {
      done(null, user)
    })

    passport.deserializeUser(function (user: User, done) {
      done(null, user)
    })

    // routes
    app.use(apiRoutes)

    // run
    app.listen(port, () => console.log(`[server]: ⚡ Running on ${url}:${port}`))
  })
  .catch((err) => {
    console.error(err)
  })
