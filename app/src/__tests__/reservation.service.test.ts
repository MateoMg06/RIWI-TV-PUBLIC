import sequelize from '../config/database';
import ErrorHandler from '../error/errorHandler';
import Seat from '../models/seat.model';
import SeatLock from '../models/seat-lock.model';
import Showtime from '../models/showtime.model';
import reservationService from '../services/reservation.service';

const transaction = { LOCK: { UPDATE: 'UPDATE' } } as any;
const seat = (id: number, code: string, status = 'AVAILABLE') => ({
  id,
  code,
  showtimeId: 7,
  row: 'A',
  number: id,
  type: 'STANDARD',
  status,
  priceModifier: 2000,
});

describe('ReservationService', () => {
  beforeEach(() => {
    jest.spyOn(sequelize, 'transaction').mockImplementation(async (...args: any[]) => {
      const callback = typeof args[0] === 'function' ? args[0] : args[1];
      return callback(transaction);
    });
    jest.spyOn(SeatLock, 'findAll').mockResolvedValue([]);
    jest.spyOn(Showtime, 'findOne').mockResolvedValue({ id: 7, price: 18000 } as Showtime);
    jest.spyOn(Seat, 'count').mockResolvedValue(8);
    jest.spyOn(Showtime, 'update').mockResolvedValue([1]);
  });

  afterEach(() => jest.restoreAllMocks());

  it('bloquea sillas por diez minutos y calcula el total', async () => {
    jest.spyOn(Seat, 'findAll').mockResolvedValue([seat(1, 'A1'), seat(2, 'A2')] as Seat[]);
    jest.spyOn(Seat, 'update').mockResolvedValue([2]);
    jest.spyOn(SeatLock, 'bulkCreate').mockResolvedValue([{ id: 10 }, { id: 11 }] as SeatLock[]);

    const result = await reservationService.lockSeats(3, 7, [1, 2]);

    expect(result.seats).toEqual(['A1', 'A2']);
    expect(result.total).toBe(40000);
    expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now() + 9 * 60_000);
    expect(Seat.update).toHaveBeenCalledWith(
      { status: 'HELD' },
      expect.objectContaining({ where: expect.objectContaining({ status: 'AVAILABLE' }) }),
    );
  });

  it('rechaza de forma concurrente una silla que dejó de estar disponible', async () => {
    jest.spyOn(Seat, 'findAll').mockResolvedValue([seat(1, 'A1', 'HELD')] as Seat[]);
    await expect(reservationService.lockSeats(3, 7, [1])).rejects.toEqual(
      expect.objectContaining<Partial<ErrorHandler>>({ estado: 409 }),
    );
  });
});
