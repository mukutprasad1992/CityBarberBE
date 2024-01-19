import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose'; // Import the Model type from mongoose
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from '../dto/signup.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
//Making user class and constructor
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  //Register a new user and password is hashed
  async register(signUpDto: SignUpDto): Promise<{ user: User; token: string }> {
    const { name, email, password, userType } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      userType,
    });
    const token = this.generateToken(user);

    return { user, token };
  }
  private generateToken(user: User): string {
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h', // You can adjust the token expiration time as needed
      },
    );
    return token;
  }

  /* 

Making user CRUD Operations

*/
  //Get all the users
  async findAll(): Promise<User[]> {
    const user = await this.userModel.find();
    return user;
  }

  //Fetch Unique user by id
  async findbyId(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        console.log(`User with ID ${id} not found.`);
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      // Log the error for further investigation
      console.error('Error in findbyId:', error);
      throw error; // Rethrow the error
    }
  }

  //Update user by id
  async updateById(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Find the user by ID
    const existingUser = await this.userModel.findById(id);

    // If user not found, throw NotFoundException
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    Object.assign(existingUser, updateUserDto);

    // Save the updated user
    const updatedUserData = await existingUser.save();

    return updatedUserData;
  }

  async deleteById(id: string): Promise<string> {
    // Find the user by ID
    const existingUser = await this.userModel.findById(id);

    // If user not found, throw NotFoundException
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Delete the user
    await this.userModel.deleteOne({ _id: id });

    return 'User has been deleted';
  }
}
