import type { ShowtimeStatus } from '../models/showtime.model';

export interface CreateShowtimeDto {
  startsAt: string | Date;
  room: string;
  roomType?: string;
  format?: string;
  language?: string;
  audioType?: 'DUBBED' | 'SUBTITLED' | 'ORIGINAL';
  price: number;
  status?: ShowtimeStatus;
  availableSeats?: number;
}
