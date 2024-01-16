import { Injectable, UnauthorizedException } from '@nestjs/common';
import  { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10); // Hash the password
    const createdUser = await this.userModel.create({
      ...user,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  generateToken(user: User): string {
    const payload = { user: user._id, email: user.email }; // Customize the payload as needed
    const secretKey = 'vwHjkCZ8WDIRRe99'; // Replace with your actual secret key
    const expiresIn = '1h'; // Adjust expiresIn as needed

    return jwt.sign(payload, secretKey, { expiresIn });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ token: string }> {
    console.log('Email:', credentials.email);
    const user = await this.findByEmail(credentials.email);

    if (!user || !(await this.verifyPassword(user, credentials.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    return { token };
  }
}
