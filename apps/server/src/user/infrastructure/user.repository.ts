import { EntityRepository, Repository } from 'typeorm';
import { User } from '../core/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}
