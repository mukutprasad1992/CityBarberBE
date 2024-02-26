import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
  private readonly JWT_SECRET = process.env.JWT_SECRET;

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
    try {
      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const createdUser = await this.userModel.create({ ...user, password: hashedPassword });

      return createdUser.save();
    } catch (error) {
      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }

  // Find a user by ID
  async findById(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userId).exec();

      if (!user) {

        // Throw NotFoundException if user is not found
        throw new NotFoundException(ErrorMessage.userNotFound);

      }

      return user;
    } catch (error) {
      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }

  // Find a user by email
  async findByEmail(email: string): Promise<User> {

    try {
      const findByEmail = await this.userModel.findOne({ email }).exec();

      return findByEmail

    } catch (error) {
      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.INTERNAL_SERVER_ERROR)
    }

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

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    // Retrieve user by email
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Generate and send password reset email
    const resetLink = `http://your-app/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      // Configure your SMTP transporter here
      service: 'gmail',
      auth: {
        user: 'himanshubaghel2101@gmail.com',
        pass: 'gorg qanr kjlb czpx',
      },
    });

    const mailOptions = {
      from: 'himanshubaghel2101@gmail.com ',
      to: email,
      subject: 'Password Reset',
      text: `Please click the following link to reset your password: ${resetLink}`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new HttpException('Failed to send password reset email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async userResetPassword(userId: string, newPassword: string, requestingUserId: string): Promise<void> {
    // Fetch user from the database
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the user requesting the password reset is authorized
    if (user.id !== requestingUserId) {
      throw new Error('Unauthorized');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();
  }

// async sendPasswordResetEmail(user: User): Promise<void> {
//   try {
//     // Generate password reset token
//     const resetToken = jwt.sign({ userId: user._id }, process.env.ForgetPasswordKey, { expiresIn: '1h' });

//     const resetLink = `http://your-app/reset-password?token=${resetToken}`;

//     // Prepare email options
//     const mailOptions: nodemailer.SendMailOptions = {
//       from: process.env.mailSender,
//       to: user.email,
//       subject: 'Password Reset',
//       text: `Click the following link to reset your password: ${resetLink}`,
//     };

//     // Send the email
//     await this.transporter.sendMail(mailOptions);

//     console.log(`Password reset email sent to ${user.email}`);
//   } catch (error) {
//     console.error('Error sending password reset email:', error);
//     // Handle the error (e.g., log it, throw it, etc.)
//     throw error;
//   }
// }


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
  async verifyToken(token: string): Promise < { userId: string } > {
  try {
    const decodedToken = jwt.verify(token, this.JWT_SECRET) as { userId: string };
    return decodedToken;
  } catch(error) {
    throw new UnauthorizedException(`Invalid token: ${error.message}`);
  }
}
}
