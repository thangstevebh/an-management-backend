import { ForbiddenException } from '@nestjs/common';

export class PermissionDeniedException extends ForbiddenException {
  constructor(message?: string) {
    message = message || 'Permission denied';
    super(message);
  }
}
