/**
 * Rutas de Autenticación
 * ----------------------
 * Define los endpoints HTTP para registro, activación de cuenta y CAPTCHA.
 */

import { Router } from 'express';
import { getCaptcha, register, activateAccount, forgotPassword, resetPassword } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * /api/auth/captcha:
 *   get:
 *     summary: Obtener un CAPTCHA para el registro
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: CAPTCHA generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 question:
 *                   type: string
 *       500:
 *         description: Error interno del servidor
 */
router.get('/captcha', getCaptcha);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario con perfil y membresía inicial
 *     tags: [Auth]
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
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El usuario ya existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/activate:
 *   post:
 *     summary: Activar la cuenta del usuario mediante el token enviado por correo
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "abc123token"
 *     responses:
 *       200:
 *         description: Cuenta activada exitosamente
 *       400:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/activate', activateAccount);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Si el correo está registrado, se enviará un enlace de recuperación
 *       400:
 *         description: La cuenta no está activada
 *       500:
 *         description: Error interno del servidor
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Restablecer la contraseña usando un token de recuperación
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *               - confirmPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: "abc123-reset-token"
 *               password:
 *                 type: string
 *                 example: "NewSecurePass123!"
 *               confirmPassword:
 *                 type: string
 *                 example: "NewSecurePass123!"
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *       400:
 *         description: Token inválido, expirado o usado; o contraseñas no coinciden
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/reset-password', resetPassword);

export default router;
