import sequelize from '../config/database';
import { Cinema, City, Country, Department, Movie, Seat, Showtime } from '../models';
import type { MovieStatus } from '../models/movie.model';
import type { SeatType } from '../models/seat.model';

export interface SeedSeatInput {
  code: string;
  row: string;
  number: number;
  type?: SeatType;
  priceModifier?: number;
}

export interface SeedShowtimeInput {
  startsAt: string;
  room: string;
  roomType?: string;
  format?: string;
  language?: string;
  audioType?: 'DUBBED' | 'SUBTITLED' | 'ORIGINAL';
  price: number;
  seats?: SeedSeatInput[];
}

export interface SeedMovieInput {
  name: string;
  synopsis?: string;
  classification: string;
  duration: number;
  genre: string;
  director?: string;
  cast?: string[];
  posterUrl?: string;
  bannerUrl?: string;
  trailerUrl?: string;
  releaseDate: string;
  status?: MovieStatus;
  audienceRating?: number;
  showtime?: SeedShowtimeInput;
}

export interface SeedPayload {
  location: {
    country: string;
    department: string;
    city: string;
    cinema: string;
  };
  movies: SeedMovieInput[];
}

export interface SeedResult {
  message: string;
  created: {
    countries: number;
    departments: number;
    cities: number;
    cinemas: number;
    movies: number;
    showtimes: number;
    seats: number;
  };
}

const futureAt = (days: number, hour: number): Date => {
  const value = new Date();
  value.setDate(value.getDate() + days);
  value.setHours(hour, 0, 0, 0);
  return value;
};

const defaultSeats = (): SeedSeatInput[] =>
  ['A', 'B', 'C'].flatMap((row) =>
    Array.from({ length: 8 }, (_, position) => ({
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
  );

export const createDefaultSeedPayload = (): SeedPayload => ({
  location: {
    country: 'Colombia',
    department: 'Antioquia',
    city: 'Medellín',
    cinema: 'Multicine Riwi Centro',
  },
  movies: [
    {
      name: 'Horizonte Rojo',
      synopsis: 'Sinopsis de Horizonte Rojo',
      genre: 'Acción',
      classification: 'PG-13',
      duration: 128,
      director: 'Ana Torres',
      cast: ['Intérprete Uno', 'Intérprete Dos'],
      releaseDate: futureAt(-14, 0).toISOString(),
      status: 'ACTIVE',
      audienceRating: 8.4,
      showtime: {
        startsAt: futureAt(1, 18).toISOString(),
        room: 'Sala 1',
        roomType: 'STANDARD',
        format: '2D',
        language: 'Español',
        audioType: 'DUBBED',
        price: 18000,
        seats: defaultSeats(),
      },
    },
    {
      name: 'El Jardín de Luz',
      synopsis: 'Sinopsis de El Jardín de Luz',
      genre: 'Drama',
      classification: 'PG',
      duration: 112,
      director: 'Luis Vega',
      cast: ['Intérprete Uno', 'Intérprete Dos'],
      releaseDate: futureAt(-14, 0).toISOString(),
      status: 'ACTIVE',
      audienceRating: 8.1,
      showtime: {
        startsAt: futureAt(2, 19).toISOString(),
        room: 'Sala 2',
        roomType: 'VIP',
        format: 'IMAX',
        language: 'Español',
        audioType: 'DUBBED',
        price: 26000,
        seats: defaultSeats(),
      },
    },
    {
      name: 'Órbita Final',
      synopsis: 'Una expedición debe regresar antes de que su órbita colapse.',
      classification: 'PG-13',
      duration: 135,
      genre: 'Ciencia ficción',
      director: 'María León',
      cast: ['Sofía Ríos', 'Mateo Cruz'],
      trailerUrl: 'https://www.youtube.com/watch?v=example',
      releaseDate: futureAt(30, 0).toISOString(),
      status: 'UPCOMING',
      audienceRating: 0,
    },
  ],
});

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isValidDate = (value: unknown): value is string =>
  isNonEmptyString(value) && !Number.isNaN(new Date(value).getTime());

export function parseSeedPayload(value: unknown): SeedPayload {
  if (!isObject(value) || !isObject(value.location) || !Array.isArray(value.movies)) {
    throw new Error('El JSON debe contener los objetos "location" y "movies"');
  }

  const { location, movies } = value;
  for (const field of ['country', 'department', 'city', 'cinema'] as const) {
    if (!isNonEmptyString(location[field])) {
      throw new Error(`location.${field} es requerido`);
    }
  }

  if (movies.length === 0 || movies.length > 100) {
    throw new Error('movies debe contener entre 1 y 100 películas');
  }

  movies.forEach((movie, movieIndex) => {
    if (!isObject(movie)) throw new Error(`movies[${movieIndex}] debe ser un objeto`);

    for (const field of ['name', 'classification', 'genre'] as const) {
      if (!isNonEmptyString(movie[field])) {
        throw new Error(`movies[${movieIndex}].${field} es requerido`);
      }
    }
    if (!Number.isInteger(movie.duration) || Number(movie.duration) <= 0) {
      throw new Error(`movies[${movieIndex}].duration debe ser un entero positivo`);
    }
    if (!isValidDate(movie.releaseDate)) {
      throw new Error(`movies[${movieIndex}].releaseDate debe ser una fecha válida`);
    }
    if (movie.status && !['UPCOMING', 'ACTIVE', 'INACTIVE'].includes(String(movie.status))) {
      throw new Error(`movies[${movieIndex}].status no es válido`);
    }
    if (movie.cast && (!Array.isArray(movie.cast) || !movie.cast.every(isNonEmptyString))) {
      throw new Error(`movies[${movieIndex}].cast debe ser una lista de textos`);
    }

    if (movie.showtime !== undefined) {
      if (!isObject(movie.showtime)) {
        throw new Error(`movies[${movieIndex}].showtime debe ser un objeto`);
      }
      const showtime = movie.showtime;
      if (!isValidDate(showtime.startsAt) || !isNonEmptyString(showtime.room)) {
        throw new Error(`movies[${movieIndex}].showtime requiere startsAt y room válidos`);
      }
      if (typeof showtime.price !== 'number' || showtime.price < 0) {
        throw new Error(`movies[${movieIndex}].showtime.price debe ser un número positivo`);
      }
      if (
        showtime.audioType &&
        !['DUBBED', 'SUBTITLED', 'ORIGINAL'].includes(String(showtime.audioType))
      ) {
        throw new Error(`movies[${movieIndex}].showtime.audioType no es válido`);
      }
      if (showtime.seats !== undefined) {
        if (!Array.isArray(showtime.seats) || showtime.seats.length > 1000) {
          throw new Error(`movies[${movieIndex}].showtime.seats no es válido`);
        }
        showtime.seats.forEach((seat, seatIndex) => {
          if (
            !isObject(seat) ||
            !isNonEmptyString(seat.code) ||
            !isNonEmptyString(seat.row) ||
            !Number.isInteger(seat.number) ||
            Number(seat.number) <= 0
          ) {
            throw new Error(`movies[${movieIndex}].showtime.seats[${seatIndex}] no es válido`);
          }
          if (seat.type && !['STANDARD', 'VIP', 'ACCESSIBLE'].includes(String(seat.type))) {
            throw new Error(`movies[${movieIndex}].showtime.seats[${seatIndex}].type no es válido`);
          }
        });
      }
    }
  });

  return value as unknown as SeedPayload;
}

let runningSeed: Promise<SeedResult> | undefined;

async function executeSeed(payload: SeedPayload): Promise<SeedResult> {
  await sequelize.authenticate();

  return sequelize.transaction(async (transaction) => {
    const created: SeedResult['created'] = {
      countries: 0,
      departments: 0,
      cities: 0,
      cinemas: 0,
      movies: 0,
      showtimes: 0,
      seats: 0,
    };

    const [country, countryCreated] = await Country.findOrCreate({
      where: { country: payload.location.country.trim() },
      defaults: { country: payload.location.country.trim() },
      transaction,
    });
    created.countries += Number(countryCreated);

    const [department, departmentCreated] = await Department.findOrCreate({
      where: { department: payload.location.department.trim(), countryId: country.id },
      defaults: { department: payload.location.department.trim(), countryId: country.id },
      transaction,
    });
    created.departments += Number(departmentCreated);

    const [city, cityCreated] = await City.findOrCreate({
      where: { city: payload.location.city.trim(), departmentId: department.id },
      defaults: { city: payload.location.city.trim(), departmentId: department.id, active: true },
      transaction,
    });
    created.cities += Number(cityCreated);

    const [cinema, cinemaCreated] = await Cinema.findOrCreate({
      where: { name: payload.location.cinema.trim(), cityId: city.id },
      defaults: { name: payload.location.cinema.trim(), cityId: city.id, active: true },
      transaction,
    });
    created.cinemas += Number(cinemaCreated);

    for (const input of payload.movies) {
      const [movie, movieCreated] = await Movie.findOrCreate({
        where: { name: input.name.trim() },
        defaults: {
          name: input.name.trim(),
          synopsis: input.synopsis?.trim() ?? '',
          classification: input.classification.trim(),
          duration: input.duration,
          genre: input.genre.trim(),
          director: input.director?.trim() ?? '',
          cast: input.cast ?? [],
          posterUrl: input.posterUrl?.trim() || null,
          bannerUrl: input.bannerUrl?.trim() || null,
          trailerUrl: input.trailerUrl?.trim() || null,
          releaseDate: new Date(input.releaseDate),
          status: input.status ?? 'ACTIVE',
          audienceRating: input.audienceRating ?? 0,
        },
        transaction,
      });
      created.movies += Number(movieCreated);

      if (!input.showtime) continue;
      const showtimeInput = input.showtime;
      const startsAt = new Date(showtimeInput.startsAt);
      const [showtime, showtimeCreated] = await Showtime.findOrCreate({
        where: { cinemaId: cinema.id, movieId: movie.id, startsAt },
        defaults: {
          cinemaId: cinema.id,
          movieId: movie.id,
          startsAt,
          room: showtimeInput.room.trim(),
          roomType: showtimeInput.roomType?.trim() || 'STANDARD',
          format: showtimeInput.format?.trim() || '2D',
          language: showtimeInput.language?.trim() || 'Español',
          audioType: showtimeInput.audioType ?? 'DUBBED',
          price: showtimeInput.price,
          availableSeats: showtimeInput.seats?.length ?? 0,
        },
        transaction,
      });
      created.showtimes += Number(showtimeCreated);

      const requestedSeats = showtimeInput.seats ?? [];
      if (requestedSeats.length === 0) continue;

      const existingSeats = await Seat.findAll({
        attributes: ['code'],
        where: { showtimeId: showtime.id },
        transaction,
      });
      const existingCodes = new Set(existingSeats.map((seat) => seat.code));
      const missingSeats = requestedSeats.filter((seat) => !existingCodes.has(seat.code));

      if (missingSeats.length > 0) {
        const seats = await Seat.bulkCreate(
          missingSeats.map((seat) => ({
            showtimeId: showtime.id,
            code: seat.code.trim(),
            row: seat.row.trim(),
            number: seat.number,
            type: seat.type ?? 'STANDARD',
            priceModifier: seat.priceModifier ?? 0,
          })),
          { transaction },
        );
        created.seats += seats.length;
      }
    }

    return {
      message: 'Archivo JSON procesado correctamente',
      created,
    };
  });
}

export function seedDatabase(
  payload: SeedPayload = createDefaultSeedPayload(),
): Promise<SeedResult> {
  if (!runningSeed) {
    runningSeed = executeSeed(payload).finally(() => {
      runningSeed = undefined;
    });
  }

  return runningSeed;
}

if (require.main === module) {
  seedDatabase()
    .then((result) => console.log(result.message, result.created))
    .catch((error) => {
      console.error('No fue posible ejecutar el seeder', error);
      process.exitCode = 1;
    })
    .finally(() => sequelize.close());
}
