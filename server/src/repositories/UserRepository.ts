import { UserInput } from "./../inputs/UserInput";
import { plainToClass } from "class-transformer";
import { User } from "./../entity/User";
import { EntityRepository, Repository } from "typeorm";

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
