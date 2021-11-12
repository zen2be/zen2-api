import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { Appointment } from '../entities/appointment'
import { ApiResponse } from '../helpers/api-response'

export const createAppointment = async (req: Request, res: Response): Promise<Response> => {
  const appointment = getRepository(Appointment).create(req.body)
  const result = await getRepository(Appointment).save(appointment)
  return res.status(201).json(new ApiResponse(res.statusCode, result))
}

export const getAppointments = async (req: Request, res: Response): Promise<Response> => {
  const appointments = await getRepository(Appointment).find()
  return res.status(200).json(new ApiResponse(res.statusCode, appointments))
}

export const getAppointment = async (req: Request, res: Response): Promise<Response> => {
  const appointment = await getRepository(Appointment).findOne(req.params.id)
  if (appointment) {
    return res.status(200).json(new ApiResponse(res.statusCode, appointment))
  }
  return res
    .status(404)
    .json(new ApiResponse(res.statusCode, `No appointment with id ${req.params.id}`, true))
}

export const updateAppointment = async (req: Request, res: Response): Promise<Response> => {
  const appointment = await getRepository(Appointment).findOne(req.params.id)
  if (appointment) {
    getRepository(Appointment).merge(appointment, req.body)
    const result = getRepository(Appointment).save(appointment)
    return res.status(204).json(new ApiResponse(res.statusCode, result))
  }
  return res
    .status(404)
    .json(new ApiResponse(res.statusCode, `No appointment with id ${req.params.id}`, true))
}

export const deleteAppointment = async (req: Request, res: Response): Promise<Response> => {
  const appointment = await getRepository(Appointment).findOne(req.params.id)
  if (appointment) {
    const result = await getRepository(Appointment).delete(appointment.id)
    return res.status(200).json(new ApiResponse(res.statusCode, result))
  }
  return res
    .status(404)
    .json(new ApiResponse(res.statusCode, `No appointment with id ${req.params.id}`, true))
}
