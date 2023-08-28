import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { User } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { SignUpDto } from '../dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,

    @InjectModel(User.name) private readonly usersModel: Model<User>,
  ) {}

  async create(dto: SignUpDto): Promise<Omit<User, 'password'> & { id: string }> {
    const document = new this.usersModel({
      email: dto.email.toLowerCase(),
      username: dto.username,
      password: await this.hashPassword(dto.password),
    });

    const saveResult = await document.save();
    const object = saveResult.toObject();
    delete object.password;

    return { ...object, id: object._id.toHexString() };
  }

  async findOne(filterQuery: FilterQuery<User>) {
    return await this.usersModel.findOne(filterQuery, { password: false });
  }

  private async hashPassword(pw: string) {
    const saltOrRounds = +this.configService.get<string>('HASH_SALT', '10');
    return await bcrypt.hash(pw, saltOrRounds);
  }
}
