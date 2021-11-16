import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
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
