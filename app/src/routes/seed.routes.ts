import { Router, type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import seedController, { SeedController } from '../controllers/seed.controller';
import { requireSeedKey } from '../middlewares/requireSeedKey';

const jsonUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    const hasJsonExtension = file.originalname.toLowerCase().endsWith('.json');
    const hasJsonMime = ['application/json', 'text/json', 'application/octet-stream'].includes(
      file.mimetype,
    );

    if (hasJsonExtension && hasJsonMime) {
      callback(null, true);
      return;
    }

    callback(new Error('Solo se permiten archivos JSON'));
  },
});

function uploadSeedJson(req: Request, res: Response, next: NextFunction): void {
  jsonUpload.single('file')(req, res, (error: unknown) => {
    if (!error) {
      next();
      return;
    }

    const status =
      error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    res.status(status).json({
      error: status === 413 ? 'El archivo JSON supera el límite de 1 MB' : 'Archivo JSON inválido',
      detail: error instanceof Error ? error.message : String(error),
    });
  });
}

export function createSeedRouter(controller: SeedController = seedController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/v1/seed:
   *   post:
   *     summary: Carga datos demostrativos desde un archivo JSON
   *     tags: [Administration]
   *     consumes:
   *       - multipart/form-data
   *     parameters:
   *       - in: header
   *         name: x-seed-key
   *         required: true
   *         schema:
   *           type: string
   *         description: Clave configurada en SEED_API_KEY
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required: [file]
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: Archivo JSON de máximo 1 MB. Puede incluir users; por cada usuario se crean su perfil y membresía.
   *     responses:
   *       200:
   *         description: Seeder procesado correctamente
   *       401:
   *         description: Clave inválida
   *       503:
   *         description: Endpoint no configurado
   */
  router.post('/', requireSeedKey, uploadSeedJson, controller.execute);

  return router;
}

export default createSeedRouter();
