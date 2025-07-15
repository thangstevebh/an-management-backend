import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsOnlyDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsOnlyDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Please provide only date like 1996-12-09',
        ...validationOptions,
      },

      validator: {
        validate(value) {
          const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
          return typeof value === 'string' && regex.test(value);
        },
      },
    });
  };
}

export function IsOnlyHourMinute(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsOnlyHourMinute',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Please provide only date like 04:00',
        ...validationOptions,
      },

      validator: {
        validate(value) {
          const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return typeof value === 'string' && regex.test(value);
        },
      },
    });
  };
}

export function IsOnlyYear(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsOnlyYear',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Please provide only year like 1996',
        ...validationOptions,
      },

      validator: {
        validate(value) {
          const regex = /([12]\d{3})/;
          return typeof value === 'string' && regex.test(value);
        },
      },
    });
  };
}
