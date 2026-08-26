/**
 * Seeder de Datos
 * ----------------
 * Script que popula la base de datos con datos de prueba.
 * 
 * Ejecutar: npm run seed
 * 
 * Inserta:
 *  - 3 países
 *  - Departamentos por país
 *  - Ciudades por departamento
 *  - Cines por ciudad
 *  - Películas
 *  - Proyecciones (Showtime)
 */

/// <reference types="node" />

import sequelize from '../config/database';
import { Country, Department, City, Cinema, Movie, Showtime } from '../models/index';

async function seed() {
  try {
    console.log('Iniciando sincronización de la base de datos...');
    
    // Sincronizar modelos con la BD (crea las tablas si no existen)
    await sequelize.sync({ alter: true });
    console.log('✓ Base de datos sincronizada');

    // ============================================================================
    // 1. CREAR PAÍSES
    // ============================================================================
    console.log('\nCreando países...');

    const colombia = await Country.create({
      country: 'Colombia'
    });

    const mexico = await Country.create({
      country: 'México'
    });

    const argentina = await Country.create({
      country: 'Argentina'
    });

    console.log(`✓ 3 países creados (IDs: ${colombia.id}, ${mexico.id}, ${argentina.id})`);

    // ============================================================================
    // 2. CREAR DEPARTAMENTOS
    // ============================================================================
    console.log('\nCreando departamentos...');

    // Departamentos de Colombia
    const atlantico = await Department.create({
      department: 'Atlántico',
      countryId: colombia.id
    });

    const cundinamarca = await Department.create({
      department: 'Cundinamarca',
      countryId: colombia.id
    });

    // Departamentos de México
    const mexico_state = await Department.create({
      department: 'Estado de México',
      countryId: mexico.id
    });

    // Departamentos de Argentina
    const buenos_aires = await Department.create({
      department: 'Buenos Aires',
      countryId: argentina.id
    });

    console.log(`✓ 4 departamentos creados`);

    // ============================================================================
    // 3. CREAR CIUDADES
    // ============================================================================
    console.log('\nCreando ciudades...');

    const barranquilla = await City.create({
      city: 'Barranquilla',
      departmentId: atlantico.id,
      active: true
    });

    const bogota = await City.create({
      city: 'Bogotá',
      departmentId: cundinamarca.id,
      active: true
    });

    const mexico_city = await City.create({
      city: 'Ciudad de México',
      departmentId: mexico_state.id,
      active: true
    });

    const buenos_aires_city = await City.create({
      city: 'Buenos Aires',
      departmentId: buenos_aires.id,
      active: true
    });

    // Ciudad inactiva para pruebas (no seleccionable)
    await City.create({
      city: 'Ciudad Inactiva',
      departmentId: atlantico.id,
      active: false
    });

    // Ciudad sin cines activos (no seleccionable)
    await City.create({
      city: 'Ciudad Sin Cines',
      departmentId: cundinamarca.id,
      active: true
    });

    // Ciudad sin funciones activas (válida pero vacía)
    const ciudadSinFunciones = await City.create({
      city: 'Ciudad Sin Funciones',
      departmentId: buenos_aires.id,
      active: true
    });

    console.log(`✓ 7 ciudades creadas (incluye inactiva, sin cines, sin funciones)`);

    // ============================================================================
    // 4. CREAR CINES
    // ============================================================================
    console.log('\nCreando cines...');

    const cinemark_barranquilla = await Cinema.create({
      name: 'Cinemark Barranquilla',
      cityId: barranquilla.id,
      active: true
    });

    const cinepolis_bogota = await Cinema.create({
      name: 'Cinépolis Bogotá',
      cityId: bogota.id,
      active: true
    });

    const cinemark_mexico = await Cinema.create({
      name: 'Cinemark México City',
      cityId: mexico_city.id,
      active: true
    });

    const cinemark_buenos_aires = await Cinema.create({
      name: 'Cinemark Buenos Aires',
      cityId: buenos_aires_city.id,
      active: true
    });

    // Cine inactivo en ciudadSinFunciones (no debe contar)
    await Cinema.create({
      name: 'Cine Inactivo Sin Funciones',
      cityId: ciudadSinFunciones.id,
      active: false
    });

    // Cine activo sin funciones en ciudadSinFunciones (ciudad sin funciones activas pero con cine activo)
    await Cinema.create({
      name: 'Cine Activo Sin Funciones',
      cityId: ciudadSinFunciones.id,
      active: true
    });

    console.log(`✓ 6 cines creados (incluye inactivo)`);

    // ============================================================================
    // 5. CREAR PELÍCULAS
    // ============================================================================
    console.log('\nCreando películas...');

    const avatar = await Movie.create({
      name: 'Avatar',
      clasification: 'PG-13',
      duration: 192,
      gener: 'Ciencia Ficción'
    });

    const spiderman = await Movie.create({
      name: 'Spiderman: No Way Home',
      clasification: 'PG-13',
      duration: 159,
      gener: 'Acción'
    });

    const inception = await Movie.create({
      name: 'Inception',
      clasification: 'PG-13',
      duration: 148,
      gener: 'Ciencia Ficción'
    });

    console.log(`✓ 3 películas creadas`);

    // ============================================================================
    // 6. CREAR PROYECCIONES (SHOWTIME)
    // ============================================================================
    console.log('\nCreando proyecciones...');

    // Avatar en Cinemark Barranquilla
    await Showtime.create({
      cinemaId: cinemark_barranquilla.id,
      movieId: avatar.id,
      horario: '19:30',
      fecha: '2026-08-20',
      sala: 'A-5',
      precio: 15.99,
      showtime_status: 'ACTIVE'
    });

    // Avatar en Cinépolis Bogotá
    await Showtime.create({
      cinemaId: cinepolis_bogota.id,
      movieId: avatar.id,
      horario: '20:00',
      fecha: '2026-08-20',
      sala: 'B-3',
      precio: 16.99,
      showtime_status: 'ACTIVE'
    });

    // Spiderman en Cinépolis Bogotá
    await Showtime.create({
      cinemaId: cinepolis_bogota.id,
      movieId: spiderman.id,
      horario: '18:00',
      fecha: '2026-08-20',
      sala: 'A-1',
      precio: 16.99,
      showtime_status: 'ACTIVE'
    });

    // Spiderman en Cinemark México City
    await Showtime.create({
      cinemaId: cinemark_mexico.id,
      movieId: spiderman.id,
      horario: '19:30',
      fecha: '2026-08-21',
      sala: 'C-2',
      precio: 14.50,
      showtime_status: 'ACTIVE'
    });

    // Inception en Cinemark Buenos Aires
    await Showtime.create({
      cinemaId: cinemark_buenos_aires.id,
      movieId: inception.id,
      horario: '20:30',
      fecha: '2026-08-22',
      sala: 'D-1',
      precio: 13.00,
      showtime_status: 'ACTIVE'
    });

    // Inception en Cinemark México City
    await Showtime.create({
      cinemaId: cinemark_mexico.id,
      movieId: inception.id,
      horario: '21:00',
      fecha: '2026-08-22',
      sala: 'A-4',
      precio: 14.50,
      showtime_status: 'ACTIVE'
    });

    // Función INACTIVA (no debe aparecer en cartelera filtrada)
    await Showtime.create({
      cinemaId: cinemark_barranquilla.id,
      movieId: inception.id,
      horario: '22:00',
      fecha: '2026-08-23',
      sala: 'A-5',
      precio: 15.99,
      showtime_status: 'INACTIVE'
    });

    // Función en cine inactivo (no debe aparecer) - usando cinema inactivo de ciudadSinFunciones
    // Se crea cine inactivo temporal ya arriba; creamos función INACTIVE para prueba
    const cineInactivo = await Cinema.findOne({ where: { name: 'Cine Inactivo Sin Funciones' } });
    if (cineInactivo) {
      await Showtime.create({
        cinemaId: cineInactivo.id,
        movieId: avatar.id,
        horario: '19:00',
        fecha: '2026-08-24',
        sala: 'B-1',
        precio: 12.00,
        showtime_status: 'ACTIVE'
      });
    }

    console.log(`✓ 8 proyecciones creadas (incluye inactivas)`);

    console.log('\n✅ Seeder completado exitosamente');
    console.log('\nDatos de prueba insertados:');
    console.log(`  - 3 Países`);
    console.log(`  - 4 Departamentos`);
    console.log(`  - 7 Ciudades`);
    console.log(`  - 6 Cines`);
    console.log(`  - 3 Películas`);
    console.log(`  - 8 Proyecciones`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seeder:', error);
    process.exit(1);
  }
}

seed();
