import { Router } from 'express';
import { getShowtime, getShowtimePrices } from '../controllers/showtime.controller';
import { getSeats } from '../controllers/reservation.controller';

const router = Router();

/**
 * @swagger
 * /api/functions/{id}:
 *   get:
 *     tags: [Showtimes]
 *     summary: Consultar una función activa futura
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses: { 200: { description: Función }, 404: { description: No disponible } }
 * /api/functions/{id}/prices:
 *   get:
 *     tags: [Showtimes]
 *     summary: Consultar precio actualizado de una función
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses: { 200: { description: Precios } }
 * /api/functions/{id}/seats:
 *   get:
 *     tags: [Showtimes]
 *     summary: Consultar el mapa y estado actual de las sillas
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses: { 200: { description: Mapa de sillas } }
 */
router.get('/:id/prices', getShowtimePrices);
router.get('/:id/seats', getSeats);
router.get('/:id', getShowtime);

export default router;
