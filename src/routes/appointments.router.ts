import { Router } from 'express'
import {
  createAppointment,
  deleteAppointment,
  getAppointment,
  getAppointments,
  updateAppointment,
} from '../controllers/appointment.controller'
const router = Router()
router.route('').get(getAppointments).post(createAppointment)
router.route('/:id').get(getAppointment).put(updateAppointment).delete(deleteAppointment)
export default router
