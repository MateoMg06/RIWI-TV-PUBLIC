// app/src/routes/location.routes.ts

import { Router } from "express";
import locationController from "../controllers/location.controller";

/**
 * Rutas de Location
 * -----------------
 * Define los endpoints HTTP relacionados con
 * países, departamentos y ciudades.
 */

const router = Router();

/**
 * @swagger
 * /api/location/countries:
 *   get:
 *     summary: Obtiene todos los países
 *     tags: [Location]
 *     responses:
 *       200:
 *         description: Lista de países disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Colombia
 *       500:
 *         description: Error al obtener los países
 */
router.get("/countries", locationController.getCountries);


/**
 * @swagger
 * /api/location/departments/{countryId}:
 *   get:
 *     summary: Obtiene los departamentos de un país
 *     tags: [Location]
 *     parameters:
 *       - in: path
 *         name: countryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del país
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de departamentos del país
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Atlántico
 *                   country_id:
 *                     type: integer
 *                     example: 1
 *       500:
 *         description: Error al obtener los departamentos
 */
router.get(
    "/departments/:countryId",
    locationController.getDepartmentsByCountry
);


/**
 * @swagger
 * /api/location/cities/{departmentId}:
 *   get:
 *     summary: Obtiene las ciudades de un departamento
 *     tags: [Location]
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del departamento
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de ciudades del departamento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Barranquilla
 *                   department_id:
 *                     type: integer
 *                     example: 1
 *       500:
 *         description: Error al obtener las ciudades
 */
router.get(
    "/cities/:departmentId",
    locationController.getCitiesByDepartment
);

export default router;