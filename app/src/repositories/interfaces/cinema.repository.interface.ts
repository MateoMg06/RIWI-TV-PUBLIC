import Cinema, { CinemaCreationAttributes } from '../../models/cinema.model';

export interface ICinemaRepository {
  findAll(): Promise<Cinema[]>;
  findByPk(id: number): Promise<Cinema | null>;
  findByCityId(cityId: number): Promise<Cinema[]>;
  findActiveByCityId(cityId: number): Promise<Cinema[]>;
  countActiveByCityId(cityId: number): Promise<number>;
  create(data: CinemaCreationAttributes): Promise<Cinema>;
}
