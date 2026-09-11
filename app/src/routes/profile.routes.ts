import { validateJsonBody } from '../middlewares/validateJsonBody';
import { Router } from 'express';
import { getBenefits, getProfile, updateProfile } from '../controllers/profile.controller';
import { authToken } from '../middlewares/authToken';

const router = Router();
router.use(validateJsonBody);

/**
 * @swagger
 * /api/profile:
 *   get:
 *     tags: [Profile]
 *     summary: Consultar perfil, membresía, QR, compras y beneficios
 *     security: [{ cookieAuth: [] }, { bearerAuth: [] }]
 *     responses: { 200: { description: Perfil completo } }
 *   put:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name: { type: string }
 *               lastName: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *               phone: { type: string }
 *               documentType: { type: string }
 *               documentNumber: { type: string }
 *               birthDate: { type: string, format: date }
 *               city: { type: string }
 *               address: { type: string }
 *               avatar: { type: string }
 *               acceptsNotifications: { type: boolean }
 *     tags: [Profile]
 *     summary: Actualizar perfil y preferencias
 *     security: [{ cookieAuth: [] }, { bearerAuth: [] }]
 *     responses: { 200: { description: Perfil actualizado } }
 */
router.get('/', authToken, getProfile);
router.put('/', authToken, updateProfile);
router.get('/benefits', authToken, getBenefits);

export default router;
