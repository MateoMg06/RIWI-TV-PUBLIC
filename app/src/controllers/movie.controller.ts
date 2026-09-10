import type { Request, Response } from 'express';
import ErrorHandler from '../error/errorHandler';
import movieService, { CatalogFilters } from '../services/movie.service';

const positiveInt = (value: unknown): number | undefined => {
  if (value === undefined || value === '') return undefined;
  const result = Number(value);
  if (!Number.isInteger(result) || result <= 0)
    throw new ErrorHandler(400, 'El identificador debe ser un entero positivo');
  return result;
};

const sendError = (res: Response, error: unknown): Response => {
  if (error instanceof ErrorHandler) return res.status(error.estado).json({ error: error.message });
  return res.status(500).json({ error: error instanceof Error ? error.message : 'Error interno' });
};

const filtersFrom = (req: Request): CatalogFilters => ({
  cityId: positiveInt(req.query.cityId),
  cinemaId: positiveInt(req.query.cinemaId),
  genre: req.query.genre as string | undefined,
  classification: req.query.classification as string | undefined,
  language: req.query.language as string | undefined,
  roomType: req.query.roomType as string | undefined,
  format: req.query.format as string | undefined,
  available: req.query.available === 'true',
  date: req.query.date as string | undefined,
});

class MovieController {
  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(201).json(await movieService.create(req.body));
    } catch (error) {
      return sendError(res, error);
    }
  };

  getCatalog = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json(await movieService.getCatalog(filtersFrom(req)));
    } catch (error) {
      return sendError(res, error);
    }
  };

  getWeekly = this.getCatalog;

  getToday = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json(await movieService.getCatalog(filtersFrom(req), 'TODAY'));
    } catch (error) {
      return sendError(res, error);
    }
  };

  getDetail = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res
        .status(200)
        .json(
          await movieService.getDetail(positiveInt(req.params.id)!, positiveInt(req.query.cityId)),
        );
    } catch (error) {
      return sendError(res, error);
    }
  };

  getFunctions = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res
        .status(200)
        .json(
          await movieService.getFunctions(
            positiveInt(req.params.id)!,
            positiveInt(req.query.cityId),
          ),
        );
    } catch (error) {
      return sendError(res, error);
    }
  };

  getRecommendations = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res
        .status(200)
        .json(await movieService.getRecommendations(positiveInt(req.params.id)!));
    } catch (error) {
      return sendError(res, error);
    }
  };

  getUpcoming = async (_req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json(await movieService.getUpcoming());
    } catch (error) {
      return sendError(res, error);
    }
  };

  getUpcomingDetail = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res
        .status(200)
        .json(await movieService.getUpcomingDetail(positiveInt(req.params.id)!));
    } catch (error) {
      return sendError(res, error);
    }
  };
}

export { positiveInt, sendError };
export default new MovieController();
