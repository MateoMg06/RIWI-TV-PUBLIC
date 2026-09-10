import { Router } from 'express';
import { getBenefits, getProfile, updateProfile } from '../controllers/profile.controller';
import { authToken } from '../middlewares/authToken';

const router = Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     tags: [Profile]
 *     summary: Consultar perfil, membresía, QR, compras y beneficios
 *     security: [{ cookieAuth: [] }, { bearerAuth: [] }]
 *     responses: { 200: { description: Perfil completo } }
 *   put:
 *     tags: [Profile]
 *     summary: Actualizar perfil y preferencias
 *     security: [{ cookieAuth: [] }, { bearerAuth: [] }]
 *     responses: { 200: { description: Perfil actualizado } }
 */
router.get('/', authToken, getProfile);
router.put('/', authToken, updateProfile);
router.get('/benefits', authToken, getBenefits);

export default router;
