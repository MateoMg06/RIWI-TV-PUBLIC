import { Router } from 'express';
import movieController from '../controllers/movie.controller';
import { authToken } from '../middlewares/authToken';
import requireRole from '../middlewares/requireRole';

const router = Router();

/**
 * @swagger
 * /api/movies/weekly:
 *   get:
 *     tags: [Movies]
 *     summary: Cartelera activa de los próximos siete días
 *     parameters:
 *       - { in: query, name: cityId, schema: { type: integer } }
 *       - { in: query, name: genre, schema: { type: string } }
 *       - { in: query, name: classification, schema: { type: string } }
 *       - { in: query, name: language, schema: { type: string } }
 *       - { in: query, name: roomType, schema: { type: string } }
 *       - { in: query, name: format, schema: { type: string } }
 *       - { in: query, name: cinemaId, schema: { type: integer } }
 *     responses:
 *       200: { description: Cartelera semanal }
 * /api/movies/upcoming:
 *   get:
 *     tags: [Movies]
 *     summary: Próximos estrenos ordenados por fecha
 *     responses:
 *       200: { description: Próximos estrenos }
 * /api/movies/{id}:
 *   get:
 *     tags: [Movies]
 *     summary: Detalle de película con sus funciones futuras
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Detalle de película }
 *       404: { description: Película no encontrada }
 * /api/movies:
 *   get:
 *     tags: [Movies]
 *     summary: Consultar cartelera activa
 *     responses: { 200: { description: Cartelera } }
 * /api/movies/today:
 *   get:
 *     tags: [Movies]
 *     summary: Consultar cartelera de hoy
 *     responses: { 200: { description: Cartelera de hoy } }
 * /api/movies/filter:
 *   get:
 *     tags: [Movies]
 *     summary: Filtrar cartelera por fecha, género, clasificación, idioma, sala, formato y complejo
 *     responses: { 200: { description: Cartelera filtrada } }
 * /api/movies/upcoming/{id}:
 *   get:
 *     tags: [Movies]
 *     summary: Consultar detalle de un próximo estreno
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses: { 200: { description: Próximo estreno } }
 * /api/movies/{id}/functions:
 *   get:
 *     tags: [Movies]
 *     summary: Consultar funciones futuras de una película
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses: { 200: { description: Funciones } }
 * /api/movies/{id}/recommendations:
 *   get:
 *     tags: [Movies]
 *     summary: Consultar películas similares
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses: { 200: { description: Recomendaciones } }
 */
router.get('/weekly', movieController.getWeekly);
router.get('/today', movieController.getToday);
router.get('/filter', movieController.getCatalog);
router.get('/upcoming', movieController.getUpcoming);
router.get('/upcoming/:id', movieController.getUpcomingDetail);
router.get('/:id/functions', movieController.getFunctions);
router.get('/:id/recommendations', movieController.getRecommendations);
router.get('/:id', movieController.getDetail);
router.get('/', movieController.getCatalog);
router.post('/', authToken, requireRole('admin'), movieController.create);

export default router;
