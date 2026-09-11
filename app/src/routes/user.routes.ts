import { validateJsonBody } from '../middlewares/validateJsonBody';
/**
 * Rutas de Usuario
 * ----------------
 * Define los endpoints HTTP relacionados con la entidad User.
 */

import { Router } from 'express';

import {
  authUser,
  createUser,
  getUsers,
  updateUser,
  setLocation,
} from '../controllers/user.controller';
import { authToken } from '../middlewares/authToken';
import requireRole from '../middlewares/requireRole';

const router = Router();
router.use(validateJsonBody);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Registrar usuario con CAPTCHA, perfil, membresía y activación
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lastName
 *               - email
 *               - confirmEmail
 *               - password
 *               - confirmPassword
 *               - phone
 *               - documentType
 *               - documentNumber
 *               - birthDate
 *               - city
 *               - acceptsDataProcessing
 *               - acceptsTerms
 *               - captchaToken
 *               - captchaAnswer
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 description: Debe ser único
 *                 example: nuevo.usuario@example.com
 *               confirmEmail:
 *                 type: string
 *                 example: nuevo.usuario@example.com
 *               password:
 *                 type: string
 *                 example: "SecurePass123!"
 *               confirmPassword:
 *                 type: string
 *                 example: "SecurePass123!"
 *               phone:
 *                 type: string
 *                 example: "3001234567"
 *               documentType:
 *                 type: string
 *                 example: "CC"
 *               documentNumber:
 *                 type: string
 *                 description: Debe ser único
 *                 example: "9876543210"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               city:
 *                 type: string
 *                 example: "Bogotá"
 *               address:
 *                 type: string
 *                 example: "Calle 123 #45-67"
 *               avatar:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *               acceptsDataProcessing:
 *                 type: boolean
 *                 example: true
 *               acceptsTerms:
 *                 type: boolean
 *                 example: true
 *               acceptsNotifications:
 *                 type: boolean
 *                 example: true
 *               captchaToken:
 *                 type: string
 *               captchaAnswer:
 *                 type: number
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: integer
 *                 emailSent:
 *                   type: boolean
 *                 activationToken:
 *                   type: string
 *                   description: Solo se incluye fuera de producción cuando SMTP no está configurado
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El usuario ya existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', createUser);
router.post('/register', createUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     security: [{ cookieAuth: [] }, { bearerAuth: [] }]
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', authToken, requireRole('admin'), getUsers);
router.get('/getUsers', authToken, requireRole('admin'), getUsers);

/**
 * @swagger
 * /api/users/auth:
 *   post:
 *     summary: Autenticar usuario por email y contraseña
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: "123"
 *     responses:
 *       200:
 *         description: Usuario autenticado exitosamente
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
router.post('/auth', authUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar los datos del propio usuario autenticado
 *     tags: [Users]
 *     security: [{ cookieAuth: [] }, { bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Debe coincidir con el ID del usuario autenticado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               documentType:
 *                 type: string
 *               documentNumber:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               city:
 *                 type: string
 *               acceptsDataProcessing:
 *                 type: boolean
 *               acceptsTerms:
 *                 type: boolean
 *               acceptsNotifications:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos inválidos o sin campos para actualizar
 *       401:
 *         description: Usuario sin token/ token inválido
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: El correo ya está en uso por otro usuario
 *       500:
 *         description: Error interno del servidor
 */
/**
 * @swagger
 * /api/users/location:
 *   post:
 *     tags: [Location]
 *     summary: Guardar la ciudad del usuario autenticado
 *     security: [{ cookieAuth: [] }, { bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cityId]
 *             properties:
 *               cityId: { type: integer, minimum: 1 }
 *     responses:
 *       200: { description: Ubicación actualizada }
 *       400: { description: ID inválido }
 *       401: { description: Sesión inválida }
 *       404: { description: Ciudad no encontrada }
 *       422: { description: Ciudad inactiva o sin cines activos }
 */
router.post('/location', authToken, setLocation);
router.put('/location', authToken, setLocation);
router.put('/:id', authToken, requireRole('admin', 'usuario'), updateUser);
router.post('/legacy-login', authUser);

export default router;
