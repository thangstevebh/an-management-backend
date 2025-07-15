import { HttpStatus } from '@nestjs/common';
import { ReturnStatus } from '../constants/common.constants';

export interface ICommonResponse<T = any> {
  data: T;
  code: HttpStatus;
  status: ReturnStatus;
  error?: string | string[] | null;
  message?: string | string[];
}
