import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { User } from './user.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string): Promise<User> {
    // See if email is in use
    const user = await this.usersService.find(email);

    if (user.length) {
      throw new BadRequestException('Email already in use');
    }

    // Hash the users password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const newUser = await this.usersService.create(email, result);

    // Return the user
    return newUser;
  }

  async signin(email: string, password: string): Promise<User> {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('Email not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }

    return user;
  }
}
