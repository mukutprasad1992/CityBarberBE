import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
 
  private transporter: nodemailer.Transporter;

    constructor(@InjectModel(User.name) private userModel: Model<User>) {
      this.transporter = nodemailer.createTransport({ service: 'gmail',
      auth: {
        user: process.env.mailSender,
        pass: process.env.ForgetPasswordKey,
      },
    });
    }

    async create(user: User): Promise<User> {
      const hashedPassword = await bcrypt.hash(user.password, 10); // Hash the password
      const createdUser = await this.userModel.create({
        ...user,
        password: hashedPassword,
      });
      return createdUser.save();
    }

    async findById(userId: string): Promise<User> {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }
    async findByEmail(email: string): Promise<User> {
      return this.userModel.findOne({ email }).exec();
    }

    async verifyPassword(user: User, password: string): Promise<boolean> {
      return bcrypt.compare(password, user.password);
    }
    
    async login(credentials: {
      email: string;
      password: string;
    }): Promise<{ token: string }> {
      console.log('Email:', credentials.email);
      const user = await this.findByEmail(credentials.email);

      if (!user || !(await this.verifyPassword(user, credentials.password))) {
        console.log("user not found");
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.generateToken(user);

      return { token };
    }


    async sendPasswordResetEmail(user: User): Promise<void> {
      const resetToken = jwt.sign({ userId: user._id }, process.env.ForgetPasswordKey, { expiresIn: '1h' });

      const resetLink = `http://your-app/reset-password?token=${resetToken}`;

      // Email content
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.mailSender,
        to: user.email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: ${resetLink}`,
      };

    // Send the email
    await this.transporter.sendMail(mailOptions);
  }

  generateToken(user: User): string {
    const payload = {
      user: user._id,
      email: user.email,
      userType: user.userType,
    };
    const secretKey = 'vwHjkCZ8WDIRRe99'; // Replace with your actual secret key
    const expiresIn = '1h'; // Adjust expiresIn as needed

    return jwt.sign(payload, secretKey, { expiresIn });
  }

  verifyToken(token: string): Promise<{ userId: string }> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          // Token verification failed
          reject(new UnauthorizedException('Invalid token'));
        } else {
          // Token is valid, resolve with decoded token
          resolve(decodedToken as { userId: string });
        }
      });
    });
  }
}
