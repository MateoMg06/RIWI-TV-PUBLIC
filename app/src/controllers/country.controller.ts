import { Request, Response } from 'express';
import countryService from '../services/country.service';
import { CreateCountryDto } from '../dto/create-country.dto';
import ErrorHandler from '../error/errorHandler';

export const getCountries = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const countries = await countryService.findAll();
    return res.status(200).json(countries);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getCountryDepartments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const countryId = parseInt(id as string, 10);

    if (isNaN(countryId) || countryId <= 0) {
      return res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
    }

    // Validar que el país existe
    const country = await countryService.findByPk(countryId);
    if (!country) {
      return res.status(404).json({ error: 'País no encontrado' });
    }

    const departments = await countryService.getDepartments(countryId);
    return res.status(200).json(departments);
  } catch (error: any) {
    if (error instanceof ErrorHandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const createCountry = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const dto: CreateCountryDto = req.body;

    // Validar que el cuerpo tenga el campo requerido
    if (!dto.country || typeof dto.country !== 'string' || dto.country.trim() === '') {
      return res.status(400).json({ error: 'El campo "country" es requerido y debe ser un string no vacío' });
    }

    const country = await countryService.create(dto);
    return res.status(201).json(country);
  } catch (error: any) {
    if (error instanceof ErrorHandler) {
      return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};
