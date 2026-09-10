import sequelize from '../config/database';
import { Cinema, City, Country, Department, Movie, Seat, Showtime } from '../models';

const futureAt = (days: number, hour: number): Date => {
  const value = new Date();
  value.setDate(value.getDate() + days);
  value.setHours(hour, 0, 0, 0);
  return value;
};

async function seed(): Promise<void> {
  await sequelize.authenticate();

  const [colombia] = await Country.findOrCreate({
    where: { country: 'Colombia' },
    defaults: { country: 'Colombia' },
  });
  const [antioquia] = await Department.findOrCreate({
    where: { department: 'Antioquia', countryId: colombia.id },
    defaults: { department: 'Antioquia', countryId: colombia.id },
  });
  const [medellin] = await City.findOrCreate({
    where: { city: 'Medellín', departmentId: antioquia.id },
    defaults: { city: 'Medellín', departmentId: antioquia.id, active: true },
  });
  const [cinema] = await Cinema.findOrCreate({
    where: { name: 'Multicine Riwi Centro', cityId: medellin.id },
    defaults: { name: 'Multicine Riwi Centro', cityId: medellin.id, active: true },
  });

  const activeMovies = [
    {
      name: 'Horizonte Rojo',
      genre: 'Acción',
      classification: 'PG-13',
      duration: 128,
      director: 'Ana Torres',
      audienceRating: 8.4,
    },
    {
      name: 'El Jardín de Luz',
      genre: 'Drama',
      classification: 'PG',
      duration: 112,
      director: 'Luis Vega',
      audienceRating: 8.1,
    },
  ];
  for (const [index, data] of activeMovies.entries()) {
    const [movie] = await Movie.findOrCreate({
      where: { name: data.name },
      defaults: {
        ...data,
        synopsis: `Sinopsis de ${data.name}`,
        cast: ['Intérprete Uno', 'Intérprete Dos'],
        releaseDate: futureAt(-14, 0),
        status: 'ACTIVE',
      },
    });
    const startsAt = futureAt(index + 1, 18 + index);
    const [showtime] = await Showtime.findOrCreate({
      where: { cinemaId: cinema.id, movieId: movie.id, startsAt },
      defaults: {
        cinemaId: cinema.id,
        movieId: movie.id,
        startsAt,
        room: `Sala ${index + 1}`,
        roomType: index ? 'VIP' : 'STANDARD',
        format: index ? 'IMAX' : '2D',
        language: 'Español',
        audioType: 'DUBBED',
        price: index ? 26000 : 18000,
        availableSeats: 24,
      },
    });
    if ((await Seat.count({ where: { showtimeId: showtime.id } })) === 0) {
      await Seat.bulkCreate(
        ['A', 'B', 'C'].flatMap((row) =>
          Array.from({ length: 8 }, (_, position) => ({
            showtimeId: showtime.id,
            code: `${row}${position + 1}`,
            row,
            number: position + 1,
            type:
              row === 'C'
                ? ('VIP' as const)
                : row === 'A' && position === 0
                  ? ('ACCESSIBLE' as const)
                  : ('STANDARD' as const),
            priceModifier: row === 'C' ? 8000 : 0,
          })),
        ),
      );
    }
  }

  await Movie.findOrCreate({
    where: { name: 'Órbita Final' },
    defaults: {
      name: 'Órbita Final',
      synopsis: 'Una expedición debe regresar antes de que su órbita colapse.',
      classification: 'PG-13',
      duration: 135,
      genre: 'Ciencia ficción',
      director: 'María León',
      cast: ['Sofía Ríos', 'Mateo Cruz'],
      trailerUrl: 'https://www.youtube.com/watch?v=example',
      releaseDate: futureAt(30, 0),
      status: 'UPCOMING',
      audienceRating: 0,
    },
  });

  console.log('Datos de demostración HU-001 a HU-010 creados correctamente');
  await sequelize.close();
}

seed().catch(async (error) => {
  console.error('No fue posible ejecutar el seeder', error);
  await sequelize.close();
  process.exitCode = 1;
});
