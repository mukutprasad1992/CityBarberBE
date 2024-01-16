import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose'; // Import the Model type from mongoose
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from '../dto/signup.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async findAll(signUpDto: SignUpDto): Promise<User> {
    const { name, email, password, contact } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      contact,
    });
    return user;
  }
  async create(user: User): Promise<User> {
    const res = await this.userModel.create(user);
    return res;
  }
  async register(signUpDto: SignUpDto): Promise<User> {
    const { name, email, password, contact } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      contact,
    });

    return user;
  }
}
