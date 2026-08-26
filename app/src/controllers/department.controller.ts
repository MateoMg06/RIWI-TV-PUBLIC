import { Request, Response } from 'express';
import departmentService from '../services/department.service';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import errorhandler from '../error/errorHandler';

export const getDepartmentCities = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const departmentId = parseInt(id as string, 10);

    if (isNaN(departmentId) || departmentId <= 0) {
      return res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
    }

    // Validar que el departamento existe
    const department = await departmentService.findByPk(departmentId);
    if (!department) {
      return res.status(404).json({ error: 'Departamento no encontrado' });
    }

    const cities = await departmentService.getCities(departmentId);
    return res.status(200).json(cities);
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const getDepartmentsByCountryId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const raw = (req.params.countryId as string) || (req.params.id as string);
    const countryId = parseInt(raw as string, 10);

    if (isNaN(countryId) || countryId <= 0) {
      return res.status(400).json({ error: 'El countryId debe ser un número entero positivo' });
    }

    const departments = await departmentService.findByCountryId(countryId);
    // Even if country doesn't exist, return empty list; but check country existence for 404
    // Try to validate country exists via service
    if (departments.length === 0) {
      const { default: countryService } = await import('../services/country.service');
      const country = await countryService.findByPk(countryId);
      if (!country) return res.status(404).json({ error: 'País no encontrado' });
    }

    return res.status(200).json(departments);
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const createDepartment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { countryId } = req.params;
    const dto: CreateDepartmentDto = req.body;

    // Validar countryId
    const parsedCountryId = parseInt(countryId as string, 10);
    if (isNaN(parsedCountryId) || parsedCountryId <= 0) {
      return res.status(400).json({ error: 'El countryId debe ser un número entero positivo' });
    }

    // Validar DTO
    if (!dto.department || typeof dto.department !== 'string' || dto.department.trim() === '') {
      return res.status(400).json({ error: 'El campo "department" es requerido y debe ser un string no vacío' });
    }

    const department = await departmentService.create(dto, parsedCountryId);
    return res.status(201).json(department);
  } catch (error: any) {
    if (error instanceof errorhandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};
