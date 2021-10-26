import { Router, Request, Response } from 'express'
import appointmentRoutes from './appointments.router'
const router = Router()

// middleware
router.use((req: Request, res: Response, next) => {
  if (req.headers['content-type'] == null || req.headers['content-type'] != 'application/json') {
    return res.status(406).json({ error: 'We only support application/json requests.' })
  } else {
    next()
  }
})

// api routes
router.options('*', (req: Request, res: Response) => {
  if (req.headers.origin == null) {
    return res.status(400).json({ error: 'Origin header missing' })
  } else {
    return res
      .header('Access-Control-Allow-Origin', `${req.headers.origin}`)
      .header('Access-Control-Allow-Headers', '*')
      .header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
      .header('Vary', 'Origin')
      .status(200)
      .json({ success: true, headers: req.headers })
  }
})

// sub routes
router.use('/appointments', appointmentRoutes)

// not predefined routes
router.get('*', (req: Request, res: Response) => {
  return res.status(404).json({ success: false, error: 'Not Found' })
})

export default router
