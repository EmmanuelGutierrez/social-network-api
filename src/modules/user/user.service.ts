import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { roles } from 'src/common/constants/roles.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create({ password, ...data }: CreateUserDto) {
    const existUser = await this.userModel.exists({ email: data.email });
    if (existUser) {
      throw new ConflictException('user alredy exist');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      ...data,
      password: hashPassword,
    });
    delete user.password;
    return user;
  }

  async findAll() {
    const users = await this.userModel.find();
    return users;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async findOneWithPasswordByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
