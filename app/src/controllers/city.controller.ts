import { Request, Response } from 'express';
import cityService from '../services/city.service';
import { CreateCityDto } from '../dto/create-city.dto';
import ErrorHandler from '../error/errorHandler';

export const getCityCinemas = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const cityId = parseInt(id as string, 10);

    if (isNaN(cityId) || cityId <= 0) {
      return res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
    }

    // Validar que la ciudad existe
    const city = await cityService.findByPk(cityId);
    if (!city) {
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    }

    const cinemas = await cityService.getCinemas(cityId);
    return res.status(200).json(cinemas);
  } catch (error: any) {
    if (error instanceof ErrorHandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const createCity = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { departmentId } = req.params;
    const dto: CreateCityDto = req.body;

    // Validar departmentId
    const parsedDepartmentId = parseInt(departmentId as string, 10);
    if (isNaN(parsedDepartmentId) || parsedDepartmentId <= 0) {
      return res.status(400).json({ error: 'El departmentId debe ser un número entero positivo' });
    }

    // Validar DTO
    if (!dto.city || typeof dto.city !== 'string' || dto.city.trim() === '') {
      return res.status(400).json({ error: 'El campo "city" es requerido y debe ser un string no vacío' });
    }

    const city = await cityService.create(dto, parsedDepartmentId);
    return res.status(201).json(city);
  } catch (error: any) {
    if (error instanceof ErrorHandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};
