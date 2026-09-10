import Movie from '../models/movie.model';
import movieRepository from '../repositories/movie.repository';
import movieService from '../services/movie.service';

const movie = (overrides: Record<string, unknown> = {}): Movie =>
  ({
    get: () => ({
      id: 1,
      name: 'Horizonte Rojo',
      synopsis: 'Sinopsis',
      classification: 'PG-13',
      duration: 120,
      genre: 'Acción',
      director: 'Directora',
      cast: ['Actor'],
      posterUrl: null,
      bannerUrl: null,
      trailerUrl: null,
      releaseDate: new Date('2030-01-01T00:00:00Z'),
      status: 'ACTIVE',
      audienceRating: '8.5',
      ...overrides,
    }),
  }) as unknown as Movie;

describe('MovieService', () => {
  afterEach(() => jest.restoreAllMocks());

  it('consulta siete días y transmite todos los filtros de cartelera', async () => {
    const find = jest.spyOn(movieRepository, 'findCatalog').mockResolvedValue([movie()]);
    const result = await movieService.getCatalog({ cityId: 2, format: 'IMAX', available: true });
    const filters = find.mock.calls[0][0];

    expect(filters.cityId).toBe(2);
    expect(filters.format).toBe('IMAX');
    expect(filters.available).toBe(true);
    expect(filters.to.getTime() - filters.from.getTime()).toBeGreaterThanOrEqual(5 * 86_400_000);
    expect(result[0]).toMatchObject({ classification: 'PG-13', audienceRating: 8.5 });
  });

  it('ordena el contrato de próximos estrenos con contador regresivo', async () => {
    jest
      .spyOn(movieRepository, 'findUpcoming')
      .mockResolvedValue([
        movie({ status: 'UPCOMING', releaseDate: new Date(Date.now() + 2 * 86_400_000) }),
      ]);
    const result = await movieService.getUpcoming();
    expect(result[0]).toMatchObject({ status: 'UPCOMING', daysUntilRelease: expect.any(Number) });
  });
});
