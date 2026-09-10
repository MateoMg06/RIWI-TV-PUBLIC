import { Router } from 'express';
import { listCities, listCountries, listDepartments } from '../controllers/location.controller';

const router = Router();

/**
 * @swagger
 * /countries:
 *   get:
 *     tags: [Location]
 *     summary: Listar países
 *     responses: { 200: { description: Países } }
 * /departments/{countryId}:
 *   get:
 *     tags: [Location]
 *     summary: Listar departamentos del país
 *     parameters: [{ in: path, name: countryId, required: true, schema: { type: integer } }]
 *     responses: { 200: { description: Departamentos } }
 * /cities/{departmentId}:
 *   get:
 *     tags: [Location]
 *     summary: Listar ciudades activas del departamento
 *     parameters: [{ in: path, name: departmentId, required: true, schema: { type: integer } }]
 *     responses: { 200: { description: Ciudades } }
 */
router.get('/countries', listCountries);
router.get('/departments/:countryId', listDepartments);
router.get('/cities/:departmentId', listCities);

export default router;
