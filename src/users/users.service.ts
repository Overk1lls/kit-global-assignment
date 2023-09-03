import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, Types } from 'mongoose';
import { SignUpDto } from '../auth/dto';
import { User } from './schemas';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,

    @InjectModel(User.name) private readonly UserModel: Model<User>,
  ) {}

  async create(dto: SignUpDto): Promise<Omit<User, 'password'> & { _id: Types.ObjectId }> {
    const document = await this.UserModel.create({
      email: dto.email.toLowerCase(),
      username: dto.username,
      password: await this.hashPassword(dto.password),
    });
    const object = document.toObject();
    delete object.password;

    return object;
  }

  async findOne(filterQuery: FilterQuery<User>, projection: ProjectionType<User> = { password: false }) {
    const user = await this.UserModel.findOne(filterQuery, projection);
    return user?.toObject();
  }

  private async hashPassword(pw: string) {
    const saltOrRounds = +this.configService.get<string>('HASH_SALT', '10');
    return await bcrypt.hash(pw, saltOrRounds);
  }
}
