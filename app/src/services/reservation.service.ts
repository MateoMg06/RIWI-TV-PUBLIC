import { Op, Transaction } from 'sequelize';
import sequelize from '../config/database';
import ErrorHandler from '../error/errorHandler';
import Cinema from '../models/cinema.model';
import Movie from '../models/movie.model';
import Seat from '../models/seat.model';
import SeatLock from '../models/seat-lock.model';
import Showtime from '../models/showtime.model';

class ReservationService {
  private get lockMinutes(): number {
    return Number(process.env.SEAT_LOCK_MINUTES || 10);
  }
  private get maxSeats(): number {
    return Number(process.env.MAX_SEATS_PER_RESERVATION || 10);
  }

  async purgeExpired(showtimeId?: number): Promise<number> {
    return sequelize.transaction(async (transaction) => {
      const where: any = { status: 'ACTIVE', expiresAt: { [Op.lte]: new Date() } };
      if (showtimeId) where.showtimeId = showtimeId;
      const locks = await SeatLock.findAll({ where, transaction, lock: transaction.LOCK.UPDATE });
      if (!locks.length) return 0;
      const seatIds = locks.map((item) => item.seatId);
      await SeatLock.update(
        { status: 'EXPIRED', releasedAt: new Date() },
        { where: { id: locks.map((item) => item.id) }, transaction },
      );
      await Seat.update(
        { status: 'AVAILABLE' },
        { where: { id: seatIds, status: 'HELD' }, transaction },
      );
      for (const currentShowtimeId of [...new Set(locks.map((item) => item.showtimeId))]) {
        await this.refreshAvailability(currentShowtimeId, transaction);
      }
      return locks.length;
    });
  }

  async getSeats(showtimeId: number) {
    await this.purgeExpired(showtimeId);
    const showtime = await Showtime.findOne({
      where: { id: showtimeId, status: 'ACTIVE', startsAt: { [Op.gt]: new Date() } },
    });
    if (!showtime) throw new ErrorHandler(404, 'Función no disponible o ya iniciada');
    const seats = await Seat.findAll({
      where: { showtimeId },
      order: [
        ['row', 'ASC'],
        ['number', 'ASC'],
      ],
    });
    const rows = seats.reduce<Record<string, unknown[]>>((result, seat) => {
      const item = seat.get({ plain: true });
      (result[seat.row] ||= []).push({
        ...item,
        price: Number(showtime.price) + Number(seat.priceModifier),
      });
      return result;
    }, {});
    return { showtimeId, room: showtime.room, screen: 'SCREEN', rows };
  }

  async lockSeats(
    userId: number,
    showtimeId: number,
    seatIds: number[],
    acceptsAccessiblePolicy = false,
  ) {
    const uniqueSeatIds = [...new Set(seatIds)];
    if (!uniqueSeatIds.length) throw new ErrorHandler(400, 'Debe seleccionar al menos una silla');
    if (uniqueSeatIds.length > this.maxSeats)
      throw new ErrorHandler(400, `Puede seleccionar máximo ${this.maxSeats} sillas`);
    await this.purgeExpired(showtimeId);

    return sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE },
      async (transaction) => {
        const showtime = await Showtime.findOne({
          where: { id: showtimeId, status: 'ACTIVE', startsAt: { [Op.gt]: new Date() } },
          transaction,
          lock: transaction.LOCK.UPDATE,
        });
        if (!showtime) throw new ErrorHandler(404, 'Función no disponible o ya iniciada');

        const seats = await Seat.findAll({
          where: { id: uniqueSeatIds, showtimeId },
          transaction,
          lock: transaction.LOCK.UPDATE,
          order: [['id', 'ASC']],
        });
        if (seats.length !== uniqueSeatIds.length)
          throw new ErrorHandler(404, 'Una o más sillas no pertenecen a la función');
        if (seats.some((seat) => seat.status !== 'AVAILABLE'))
          throw new ErrorHandler(409, 'Una o más sillas ya no están disponibles');
        if (!acceptsAccessiblePolicy && seats.some((seat) => seat.type === 'ACCESSIBLE')) {
          throw new ErrorHandler(
            422,
            'Debe aceptar la política de movilidad reducida para seleccionar estas sillas',
          );
        }

        const [updated] = await Seat.update(
          { status: 'HELD' },
          { where: { id: uniqueSeatIds, showtimeId, status: 'AVAILABLE' }, transaction },
        );
        if (updated !== uniqueSeatIds.length)
          throw new ErrorHandler(409, 'Una o más sillas fueron seleccionadas por otro usuario');

        const expiresAt = new Date(Date.now() + this.lockMinutes * 60_000);
        const locks = await SeatLock.bulkCreate(
          seats.map((seat) => ({ userId, showtimeId, seatId: seat.id, expiresAt })),
          { transaction },
        );
        await this.refreshAvailability(showtimeId, transaction);
        const total = seats.reduce(
          (sum, seat) => sum + Number(showtime.price) + Number(seat.priceModifier),
          0,
        );
        return {
          showtimeId,
          lockIds: locks.map((lock) => lock.id),
          seats: seats.map((seat) => seat.code),
          expiresAt,
          currency: 'COP',
          total,
        };
      },
    );
  }

  async releaseSeats(userId: number, seatIds?: number[]) {
    return sequelize.transaction(async (transaction) => {
      const where: any = { userId, status: 'ACTIVE' };
      if (seatIds?.length) where.seatId = [...new Set(seatIds)];
      const locks = await SeatLock.findAll({ where, transaction, lock: transaction.LOCK.UPDATE });
      if (!locks.length) throw new ErrorHandler(404, 'No hay sillas bloqueadas para liberar');
      const ids = locks.map((lock) => lock.id);
      const lockedSeatIds = locks.map((lock) => lock.seatId);
      await SeatLock.update(
        { status: 'RELEASED', releasedAt: new Date() },
        { where: { id: ids }, transaction },
      );
      await Seat.update(
        { status: 'AVAILABLE' },
        { where: { id: lockedSeatIds, status: 'HELD' }, transaction },
      );
      for (const showtimeId of [...new Set(locks.map((lock) => lock.showtimeId))])
        await this.refreshAvailability(showtimeId, transaction);
      return { released: locks.length, seatIds: lockedSeatIds };
    });
  }

  async getSummary(userId: number) {
    await this.purgeExpired();
    const locks = await SeatLock.findAll({
      where: { userId, status: 'ACTIVE', expiresAt: { [Op.gt]: new Date() } },
      include: [
        { model: Seat, as: 'seat' },
        {
          model: Showtime,
          as: 'showtime',
          include: [
            { model: Movie, as: 'movie' },
            { model: Cinema, as: 'cinema' },
          ],
        },
      ],
      order: [['expiresAt', 'ASC']],
    });
    const items = locks.map((lock) => {
      const plain = lock.get({ plain: true }) as any;
      return {
        lockId: plain.id,
        seat: plain.seat,
        showtime: plain.showtime,
        unitPrice: Number(plain.showtime.price) + Number(plain.seat.priceModifier),
        expiresAt: plain.expiresAt,
      };
    });
    return {
      items,
      currency: 'COP',
      total: items.reduce((sum, item) => sum + item.unitPrice, 0),
      expiresAt: items[0]?.expiresAt ?? null,
    };
  }

  private async refreshAvailability(showtimeId: number, transaction: Transaction): Promise<void> {
    const availableSeats = await Seat.count({
      where: { showtimeId, status: 'AVAILABLE' },
      transaction,
    });
    await Showtime.update({ availableSeats }, { where: { id: showtimeId }, transaction });
  }
}

export const startSeatLockCleanup = (): NodeJS.Timeout => {
  const timer = setInterval(() => reservationService.purgeExpired().catch(() => undefined), 60_000);
  timer.unref();
  return timer;
};

const reservationService = new ReservationService();
export default reservationService;
