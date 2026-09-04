import Cinema, { CinemaCreationAttributes } from '../models/cinema.model';
import { ICinemaRepository } from './interfaces/cinema.repository.interface';

class CinemaRepository implements ICinemaRepository {
  async findAll(): Promise<Cinema[]> {
    return await Cinema.findAll();
  }

  async findByPk(id: number): Promise<Cinema | null> {
    return await Cinema.findByPk(id);
  }

  async findByCityId(cityId: number): Promise<Cinema[]> {
    return await Cinema.findAll({
      where: { cityId },
    });
  }

  async create(data: CinemaCreationAttributes): Promise<Cinema> {
    return await Cinema.create(data);
  }
}

export default new CinemaRepository();
