// required external modules
import { Router, Request, Response } from 'express'
const router = Router()
import passport from 'passport'
import querystring from 'query-string'

// routes
router.get(
  '/login',
  passport.authenticate('auth0', {
    scope: 'openid email profile',
  }),
  (req: Request, res: Response) => {
    res.redirect('/callback')
  }
)

router.get('/callback', (req: Request, res: Response, next) => {
  passport.authenticate('auth0', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.redirect('/login')
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }
      res.redirect('/')
    })
  })(req, res, next)
})

router.get('/logout', (req: Request, res: Response) => {
  req.logOut()

  let returnTo = req.protocol + '://' + req.hostname
  const port = req.socket.localPort

  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo = process.env.APP_ENV === 'production' ? `${returnTo}/` : `${returnTo}:${port}/`
  }

  const logoutURL = new URL(`https://${process.env.AUTH0_DOMAIN}/v2/logout`)

  const searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo,
  })
  logoutURL.search = searchString

  res.redirect(logoutURL.toString())
})

// export
export default router
