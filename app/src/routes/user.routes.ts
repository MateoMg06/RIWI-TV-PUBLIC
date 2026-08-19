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
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: "123"
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
router.get('/', getUsers);
router.get('/getUsers', getUsers);

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
router.post('/refresh', refresh);

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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               membership:
 *                 type: string
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
router.put('/:id', authToken, updateUser)
router.post('/legacy-login', authUser);

export default router;
