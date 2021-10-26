import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { Appointment } from '../entities/appointment'

export const createAppointment = async (req: Request, res: Response): Promise<Response> => {
  const appointment = getRepository(Appointment).create(req.body)
  const result = await getRepository(Appointment).save(appointment)
  return res.status(201).json(result)
}

export const getAppointments = async (req: Request, res: Response): Promise<Response> => {
  const appointments = await getRepository(Appointment).find()
  return res.status(200).json(appointments)
}

export const getAppointment = async (req: Request, res: Response): Promise<Response> => {
  const appointment = await getRepository(Appointment).findOne(req.params.id)
  if (appointment) {
    return res.status(200).json(appointment)
  }
  return res.status(404).json({ success: false, error: `No appointment with id ${req.params.id}` })
}

export const updateAppointment = async (req: Request, res: Response): Promise<Response> => {
  const appointment = await getRepository(Appointment).findOne(req.params.id)
  if (appointment) {
    getRepository(Appointment).merge(appointment, req.body)
    const result = getRepository(Appointment).save(appointment)
    return res.status(204).json(result)
  }
  return res.status(404).json({ success: false, error: `No appointment with id ${req.params.id}` })
}

export const deleteAppointment = async (req: Request, res: Response): Promise<Response> => {
  const appointment = await getRepository(Appointment).findOne(req.params.id)
  if (appointment) {
    const result = await getRepository(Appointment).delete(appointment.id)
    return res.status(200).json(result)
  }
  return res.status(404).json({ success: false, error: `No appointment with id ${req.params.id}` })
}
