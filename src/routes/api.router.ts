import { Router, Request, Response } from 'express'
import appointmentRoutes from './appointments.router'
import authRoutes from './auth.router'
import validator from 'validator'
import { ApiResponse } from '../helpers/api-response'
const router = Router()

// middleware
router.use((req: Request, res: Response, next) => {
  if (req.method !== 'GET') {
    if (req.headers['content-type'] == null || req.headers['content-type'] != 'application/json') {
      return res
        .status(406)
        .json(
          new ApiResponse(
            res.statusCode,
            'We only support application/json requests.',
            true
          ).toJSON()
        )
    } else {
      if (!validator.isJSON(JSON.stringify(req.body))) {
        return res
          .status(406)
          .json(
            new ApiResponse(
              res.statusCode,
              "Your application/json request isn't valid JSON",
              true
            ).toJSON()
          )
      }
    }
  }
  next()
})

// api routes
router.options('*', (req: Request, res: Response) => {
  if (req.headers.origin == null) {
    return res
      .status(400)
      .json(new ApiResponse(res.statusCode, 'Origin header missing', true).toJSON())
  } else {
    return res
      .header('Access-Control-Allow-Origin', `${req.headers.origin}`)
      .header('Access-Control-Allow-Headers', '*')
      .header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
      .header('Vary', 'Origin')
      .status(200)
      .json(new ApiResponse(res.statusCode, { headers: req.headers }).toJSON())
  }
})

// sub routes
router.use('/auth', authRoutes)
router.use('/appointments', appointmentRoutes)

// not predefined routes
router.get('*', (req: Request, res: Response) => {
  return res
    .status(404)
    .json(
      new ApiResponse(
        res.statusCode,
        'Sorry, we could not find what you were looking for.',
        true
      ).toJSON()
    )
})

export default router
