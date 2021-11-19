import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { createHash } from 'crypto';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role, User } from 'src/users/user.entity';
import { getRepository } from 'typeorm';

@ValidatorConstraint({ name: 'IsSpecialist', async: true })
export class IsSpecialist implements ValidatorConstraintInterface {
  async validate(user: User, args: ValidationArguments) {
    if (user.role) {
      return user.role === Role.Specialist;
    } else if (user.id) {
      const userFound = await getRepository(User).findOne(user.id);

      return userFound.role === Role.Specialist;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'User is not a specialist, choose a correct user';
  }
}

@ValidatorConstraint({ name: 'IsPatient', async: true })
export class IsPatient implements ValidatorConstraintInterface {
  async validate(user: User, args: ValidationArguments) {
    if (user.role) {
      return user.role === Role.Patient;
    } else if (user.id) {
      const userFound = await getRepository(User).findOne(user.id);

      return userFound.role === Role.Patient;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'User is not a patient, choose a correct user';
  }
}
@ValidatorConstraint({ name: 'PasswordIsNotCommonlyUsed', async: true })
@Injectable()
export class PasswordIsNotCommonlyUsed implements ValidatorConstraintInterface {
  constructor(private http: HttpService) {}
  async validate(password: string, args: ValidationArguments) {
    const shaString = createHash('sha1').update(password).digest('hex');
    const prefix = shaString.substring(0, 5);
    const suffix = shaString.substring(5, shaString.length);
    let breached = false;
    const response = await lastValueFrom(
      this.http
        .get(`https://api.pwnedpasswords.com/range/${prefix}`)
        .pipe(map((res) => res.data)),
    );
    const hashes = response.split('\r\n');

    for (let i = 0; i < hashes.length; i++) {
      const hash = hashes[i];
      const h = hash.split(':');
      if (h[0] === suffix.toUpperCase() && h[1] >= 300) {
        breached = true;
        break;
      }
    }
    return !breached;
  }

  defaultMessage(args: ValidationArguments) {
    return 'The password you used is too common';
  }
}
