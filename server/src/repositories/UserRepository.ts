import { EntityRepository, Repository } from "typeorm";
import { plainToClass } from "class-transformer";
import { UserInput } from "../inputs/UserInput";
import { User } from "../entities/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findById(id: string): Promise<User> {
    return this.findOne({ id });
  }

  findByShibbolethUid(shibbolethUid: string): Promise<User> {
    return this.findOne({ shibbolethUid });
  }

  addUser(data: object): Promise<User> {
    const user = this.create(plainToClass(UserInput, data));
    return this.save(user);
  }

  async updateUser(id: string, data: object): Promise<User> {
    await this.update(id, data);
    return this.findById(id);
  }
}
