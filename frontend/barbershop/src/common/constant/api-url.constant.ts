import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.NEXT_PUBLIC_URL_API;

export const ApiBarber = {
  GET_ALL: `${BASE_URL}/barbers`,
  GET_DETAIL: `${BASE_URL}/barbers`,
};
