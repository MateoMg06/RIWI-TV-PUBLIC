import { swaggerSpec } from '../docs/swagger';

describe('Swagger HU-001 a HU-010', () => {
  it('publica las operaciones principales del backlog', () => {
    const paths = (swaggerSpec as { paths?: Record<string, unknown> }).paths ?? {};
    expect(Object.keys(paths)).toEqual(
      expect.arrayContaining([
        '/api/v1/health',
        '/countries',
        '/api/movies/weekly',
        '/api/movies/{id}',
        '/api/movies/upcoming',
        '/api/auth/register',
        '/api/auth/login',
        '/api/profile',
        '/api/functions/{id}/prices',
        '/api/functions/{id}/seats',
        '/api/reservations/lock-seats',
      ]),
    );
  });
});
