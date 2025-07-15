import { HttpStatus } from '@nestjs/common';
import { ReturnStatus } from '../constants/common.constants';

export interface ICommonResponse<T = any> {
  data: T;
  code: HttpStatus;
  status: ReturnStatus;
  error?: string | string[] | null;
  message?: string | string[];
}

export interface IMailOptions {
  to?: string;
  cc?: string;
  bcc?: string;
  from?: string;
  subject?: string;
  text?: string;
  context?: {
    [name: string]: any;
  };
  template?: string;
}

export interface IPaginationData<T = any> {
  data: T;
  page: number;
  limit: number;
  total: number;
}

export interface IPageDetail {
  totalDocs: number | null;
  totalPage: number | null;
  nextPage: number | null;
  prevPage: number | null;
  page: number | null;
  hasNextPage: boolean | null;
  hasPrevPage: boolean | null;
}
