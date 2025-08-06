import { ICommonResponse, IPageDetail } from "../interfaces/common.interface";

export function CommonResponse(params: ICommonResponse): ICommonResponse {
  return {
    code: params.code,
    status: params.status,
    error: params?.error ? params?.error : null,
    message: Array.isArray(params.message) ? params.message : params?.message,
    data: params.data,
  };
}

export function paginating(totalCount: any, page: number, limit: number): IPageDetail {
  const totalDocs = totalCount && totalCount.length ? totalCount[0].totalCount : 0;
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

export function paginatingByCount(totalDocs: number, page: number, limit: number): IPageDetail {
  let totalPage = 1;
  let nextPage = null;
  let prevPage = null;
  let hasNextPage = false;
  let hasPrevPage = false;

  if (page >= 1 && limit >= 1) {
    totalPage = Math.ceil(totalDocs / limit);
    nextPage = page + 1 <= totalPage ? page + 1 : null;
    prevPage = page - 1 > 0 ? page - 1 : null;
    hasNextPage = page < totalPage ? true : false;
    hasPrevPage = page > 1 ? true : false;
  }

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
function getRandomUppercaseLetter() {
  const minCharCode = "A".charCodeAt(0); // 65
  const maxCharCode = "Z".charCodeAt(0); // 90

  const randomCharCode = Math.floor(Math.random() * (maxCharCode - minCharCode + 1)) + minCharCode;

  return String.fromCharCode(randomCharCode);
}

export function getRandomString(length: number) {
  if (length < 0 || !Number.isInteger(length)) {
    return "";
  }

  let result = "";
  for (let i = 0; i < length; i++) {
    result += getRandomUppercaseLetter();
  }
  return result;
}
export function getRandomNumberString(length: number) {
  if (length <= 0 || !Number.isInteger(length)) {
    return "";
  }

  const maxNumber = Math.pow(10, length) - 1;
  const randomNumber = Math.floor(Math.random() * (maxNumber + 1));
  let randomString = randomNumber.toString();
  randomString = randomString.padStart(length, "0");

  return randomString;
}
