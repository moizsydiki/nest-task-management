import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';

import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class UserRepository {
  public readonly repository: Repository<User>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = dataSource.getRepository(User);
  }
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.repository.create({ username, password: hashedPassword });

    try {
      await this.repository.save(user);
    } catch (error) {
      const dbError = error as { code?: string };
      if (dbError.code === '23505') {
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
