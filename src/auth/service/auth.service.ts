import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import { ObjectId } from 'mongodb';
import { ErrorMessage } from 'src/utils/responseUtils';

@Injectable()
export class AuthService {

  private transporter: nodemailer.Transporter;

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {

    // Initialize nodemailer transporter with Gmail service
    this.transporter = nodemailer.createTransport({

      service: 'gmail',

      auth: {
        user: process.env.MAIL_SENDER,

        pass: process.env.FORGET_PASSWORD_KEY,

      },
    });
  }

  // Register a new user
  async userRegister(user: User): Promise<User> {

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const createdUser = await this.userModel.create({ ...user, password: hashedPassword });

    return createdUser.save();
  }

  // Find a user by ID
  async findById(userId: string): Promise<User> {

    const user = await this.userModel.findById(userId).exec();

    if (!user) {

      // Throw NotFoundException if user is not found
      throw new NotFoundException(ErrorMessage.userNotFound);

    }

    return user;
  }

  // Find a user by email
  async findByEmail(email: string): Promise<User> {

    return this.userModel.findOne({ email }).exec();

  }

  // Verify if the provided password matches the user's password
  async verifyPassword(user: User, password: string): Promise<boolean> {

    return bcrypt.compare(password, user.password);

  }

  // Log in a user and generate JWT token
  async login(credentials: { email: string; password: string }): Promise<{ token: string }> {

    const user = await this.findByEmail(credentials.email);

    if (!user || !(await this.verifyPassword(user, credentials.password))) {

      // Throw UnauthorizedException if credentials are invalid
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate and return JWT token
    const token = this.generateToken(user);

    return { token };
  }

  // Send password reset email to the user
  async sendPasswordResetEmail(user: User): Promise<void> {
    try {
      // Generate password reset token
      const resetToken = jwt.sign({ userId: user._id }, process.env.FORGET_PASSWORD_KEY, { expiresIn: '1h' });

      const resetLink = `http://your-app/reset-password?token=${resetToken}`;

      // Prepare email options
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.MAIL_SENDER,
        to: user.email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: ${resetLink}`,
      };

      // Send the email
      await this.transporter.sendMail(mailOptions);

      console.log(`Password reset email sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      // Handle the error (e.g., log it, throw it, etc.)
      throw error;
    }
  }


  // Generate JWT token for the user
  generateToken(user: User): string {

    const tokenContent = {

      userId: user._id instanceof ObjectId ? user._id.toHexString() : user._id,

      name: user.name,

      email: user.email,

      userType: user.userType,

    };

    // Generate JWT token with user information and expiration time
    const token = jwt.sign(tokenContent, process.env.JWT_SECRET, { expiresIn: '1h' });

    return token;

  }

  // Verify JWT token
  async verifyToken(token: string): Promise<{ userId: string }> {

    // Verify the token and return decoded user ID
    return new Promise((resolve, reject) => {

      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      
        if (err) {
          
          // Throw UnauthorizedException if token is invalid
          reject(new UnauthorizedException(`Invalid token: ${err.message}`));
      
        } else {
      
          resolve(decodedToken as { userId: string });
      
        }
      });
    });
  }
}
