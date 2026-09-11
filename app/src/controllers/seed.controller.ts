import type { Request, Response } from 'express';
import { parseSeedPayload, seedDatabase, type SeedPayload, type SeedResult } from '../seeders/seed';

export type SeedRunner = (payload: SeedPayload) => Promise<SeedResult>;

export class SeedController {
  constructor(private readonly runSeed: SeedRunner = seedDatabase) {}

  execute = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ error: 'Debes adjuntar un archivo JSON en el campo "file"' });
      return;
    }

    let payload: SeedPayload;
    try {
      payload = parseSeedPayload(JSON.parse(req.file.buffer.toString('utf8')));
    } catch (error) {
      res.status(400).json({
        error: 'El archivo no contiene un seeder JSON válido',
        detail: error instanceof Error ? error.message : String(error),
      });
      return;
    }

    try {
      const result = await this.runSeed(payload);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        error: 'No fue posible ejecutar el seeder',
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  };
}

export default new SeedController();
