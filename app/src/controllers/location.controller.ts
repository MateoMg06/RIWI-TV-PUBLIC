import type { Request, Response } from 'express';
import countryService from '../services/country.service';
import departmentService from '../services/department.service';

const idFrom = (value: unknown): number => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new Error('El ID debe ser un entero positivo');
  return id;
};

export const listCountries = async (_req: Request, res: Response): Promise<Response> =>
  res.status(200).json(await countryService.findAll());

export const listDepartments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const countryId = idFrom(req.params.countryId);
    if (!(await countryService.findByPk(countryId)))
      return res.status(404).json({ error: 'País no encontrado' });
    return res.status(200).json(await countryService.getDepartments(countryId));
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'ID inválido' });
  }
};

export const listCities = async (req: Request, res: Response): Promise<Response> => {
  try {
    const departmentId = idFrom(req.params.departmentId);
    if (!(await departmentService.findByPk(departmentId)))
      return res.status(404).json({ error: 'Departamento no encontrado' });
    return res.status(200).json(await departmentService.getCities(departmentId));
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'ID inválido' });
  }
};
