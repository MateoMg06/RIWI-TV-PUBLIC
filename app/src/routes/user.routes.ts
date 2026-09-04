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
  login,
  logout,
  refresh,
  updateUser,
} from '../controllers/user.controller';
import { authToken } from '../middlewares/authToken';
import requireRole from '../middlewares/requireRole';

const router = Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               confirmEmail:
 *                 type: string
 *                 example: john.doe@example.com
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
 *                 example: "1234567890"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               city:
 *                 type: string
 *                 example: "Bogotá"
 *               acceptsDataProcessing:
 *                 type: boolean
 *                 example: true
 *               acceptsTerms:
 *                 type: boolean
 *                 example: true
 *               acceptsNotifications:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', createUser);
router.post('/register', createUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', authToken, requireRole("admin"), getUsers);
router.get('/getUsers', authToken, requireRole("admin"), getUsers);

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
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión con JWT
 *     tags: [Auth]
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
 *       201:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error interno del servidor
 */
router.post('/login', login);

/**
 * @swagger
 * /api/users/refresh:
 *   post:
 *     summary: Refrescar el token y darle uno nuevo al usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       201:
 *         description: Nuevo accessToken generado
 *       401:
 *         description: Refresh token inválido, expirado o no proporcionado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/refresh', authToken, refresh);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Cierra la sesión, eliminando la cookie del accessToken
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 */
router.post('/logout', logout);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar los datos de un usuario existente
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
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
router.put('/:id', authToken, requireRole("admin", "usuario"), updateUser)
router.post('/legacy-login', authUser);

export default router;
