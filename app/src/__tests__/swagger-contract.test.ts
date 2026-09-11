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
        '/api/auth/forgot-password',
        '/api/auth/login',
        '/api/profile',
        '/api/functions/{id}/prices',
        '/api/functions/{id}/seats',
        '/api/reservations/lock-seats',
      ]),
    );
  });

  it('documenta el resetToken de desarrollo en forgot-password', () => {
    const operation = (swaggerSpec as any).paths['/api/auth/forgot-password'].post;
    const properties = operation.responses['200'].content['application/json'].schema.properties;

    expect(properties).toHaveProperty('resetToken');
    expect(properties).toHaveProperty('resetTokenExpires');
  });

  it('documenta la creación de películas como operación protegida', () => {
    const operation = (swaggerSpec as any).paths['/api/movies'].post;

    expect(operation).toBeDefined();
    expect(operation.security).toEqual(
      expect.arrayContaining([{ bearerAuth: [] }, { cookieAuth: [] }]),
    );
    expect(operation.requestBody.content['application/json']).toBeDefined();
  });

  it('no publica rutas de autenticación duplicadas bajo /api/users', () => {
    const paths = (swaggerSpec as { paths?: Record<string, unknown> }).paths ?? {};

    expect(paths).not.toHaveProperty('/api/users/login');
    expect(paths).not.toHaveProperty('/api/users/refresh');
    expect(paths).not.toHaveProperty('/api/users/logout');
  });
});
