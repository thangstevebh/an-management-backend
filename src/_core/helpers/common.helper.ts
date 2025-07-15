import { ICommonResponse } from '../interceptors/common.interface';
import { IPageDetail } from '../interfaces/common.interface';

export function CommonResponse(params: ICommonResponse): ICommonResponse {
  return {
    code: params.code,
    status: params.status,
    error: params?.error ? params?.error : null,
    message: Array.isArray(params.message) ? params.message : params?.message,
    data: params.data,
  };
}

export function paginating(
  totalCount: any,
  page: number,
  limit: number,
): IPageDetail {
  const totalDocs =
    totalCount && totalCount.length ? totalCount[0].totalCount : 0;
  const totalPage = Math.ceil(totalDocs / limit);
  const nextPage = page + 1 <= totalPage ? page + 1 : null;
  const prevPage = page - 1 > 0 ? page - 1 : null;
  const hasNextPage = page < totalPage ? true : false;
  const hasPrevPage = page > 1 ? true : false;

  return {
    totalDocs,
    totalPage,
    nextPage,
    prevPage,
    page,
    hasNextPage,
    hasPrevPage,
  };
}

export function paginatingFind(
  totalDocs: number,
  page: number,
  limit: number,
): IPageDetail {
  const totalPage = Math.ceil(totalDocs / limit);
  const nextPage = page + 2 <= totalPage ? page + 1 : null;
  const prevPage = page - 2 > 0 ? page - 1 : null;
  const hasNextPage = page < totalPage ? true : false;
  const hasPrevPage = page > 2 ? true : false;

  return {
    totalDocs,
    totalPage,
    nextPage,
    prevPage,
    page,
    hasNextPage,
    hasPrevPage,
  };
}
