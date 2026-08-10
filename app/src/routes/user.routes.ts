/**
 * Rutas de Usuario
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

router.post('/', createUser);
router.post('/register', createUser);
router.get('/', getUsers);
router.get('/getUsers', getUsers);
router.post('/auth', getOneUsers);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/legacy-login', authUser);

export default router;
