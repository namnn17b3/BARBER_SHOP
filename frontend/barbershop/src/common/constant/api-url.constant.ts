import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.NEXT_PUBLIC_URL_API;

export const ApiBarber = {
  GET_ALL: `${BASE_URL}/barbers`,
  GET_DETAIL: `${BASE_URL}/barbers`,
};

export const ApiHairColor = {
  GET_ALL: `${BASE_URL}/hair-colors`,
};

export const ApiHairStyle = {
  GET_ALL: `${BASE_URL}/hair-styles`,
  GET_DETAIL: `${BASE_URL}/hair-styles`,
}

export const ApiUser = {
  LOGIN: `${BASE_URL}/users/authen/login`,
  ME: `${BASE_URL}/users/authen/me`,
  LOGOUT: `${BASE_URL}/users/authen/logout`,
}

export const ApiFeedback = {
  STATISTICS: `${BASE_URL}/feedbacks/statistics`,
  GET_ALL: `${BASE_URL}/feedbacks`,
}
