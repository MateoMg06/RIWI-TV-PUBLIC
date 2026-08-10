/**
 * Rutas de Usuario
 * ----------------
 * Define los endpoints HTTP relacionados con la entidad User.
 */

import { Router } from 'express';

import {
  authUser,
  createUser,
  getOneUsers,
  getUsers,
  login,
  logout,
  refresh,
} from '../controllers/user.controller';

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
router.post('/auth', getOneUsers);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión con JWT
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
 *       201:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error interno del servidor
 */
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/legacy-login', authUser);

export default router;
