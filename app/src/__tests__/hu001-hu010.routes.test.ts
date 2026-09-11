import authRoutes from '../routes/auth.routes';
import locationRoutes from '../routes/location.routes';
import movieRoutes from '../routes/movie.routes';
import profileRoutes from '../routes/profile.routes';
import reservationRoutes from '../routes/reservation.routes';
import showtimeRoutes from '../routes/showtime.routes';
import userRoutes from '../routes/user.routes';

type Layer = { route?: { path: string; methods: Record<string, boolean> } };
const contracts = (router: unknown): string[] =>
  (router as { stack: Layer[] }).stack
    .filter((layer) => layer.route)
    .flatMap((layer) =>
      Object.entries(layer.route!.methods)
        .filter(([, enabled]) => enabled)
        .map(([method]) => `${method.toUpperCase()} ${layer.route!.path}`),
    );

describe('contrato HTTP HU-001 a HU-010', () => {
  it('expone ubicación, cartelera, detalle y próximos estrenos', () => {
    expect(contracts(locationRoutes)).toEqual(
      expect.arrayContaining([
        'GET /countries',
        'GET /departments/:countryId',
        'GET /cities/:departmentId',
      ]),
    );
    expect(contracts(movieRoutes)).toEqual(
      expect.arrayContaining([
        'GET /',
        'GET /weekly',
        'GET /today',
        'GET /filter',
        'GET /:id',
        'GET /:id/functions',
        'GET /:id/recommendations',
        'GET /upcoming',
        'GET /upcoming/:id',
      ]),
    );
  });

  it('expone autenticación y perfil en las rutas definidas por el backlog', () => {
    expect(contracts(authRoutes)).toEqual(
      expect.arrayContaining([
        'POST /register',
        'POST /verify-email',
        'POST /login',
        'POST /refresh',
        'POST /logout',
        'POST /forgot-password',
        'POST /reset-password',
      ]),
    );
    expect(contracts(profileRoutes)).toEqual(
      expect.arrayContaining(['GET /', 'PUT /', 'GET /benefits']),
    );
  });

  it('no duplica login, refresh ni logout bajo /api/users', () => {
    const userContracts = contracts(userRoutes);

    expect(userContracts).not.toContain('POST /login');
    expect(userContracts).not.toContain('POST /refresh');
    expect(userContracts).not.toContain('POST /logout');
  });

  it('expone función, precios, mapa de sillas, bloqueo, liberación y resumen', () => {
    expect(contracts(showtimeRoutes)).toEqual(
      expect.arrayContaining(['GET /:id', 'GET /:id/prices', 'GET /:id/seats']),
    );
    expect(contracts(reservationRoutes)).toEqual(
      expect.arrayContaining(['POST /lock-seats', 'DELETE /release-seats', 'GET /summary']),
    );
  });
});
