import Cinema, { CinemaCreationAttributes } from '../../models/cinema.model';

export interface ICinemaRepository {
  findAll(): Promise<Cinema[]>;
  findByPk(id: number): Promise<Cinema | null>;
  findByCityId(cityId: number): Promise<Cinema[]>;
  create(data: CinemaCreationAttributes): Promise<Cinema>;
}
