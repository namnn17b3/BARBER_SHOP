import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.NEXT_PUBLIC_URL_API;

export const ApiBarber = {
  GET_ALL: `${BASE_URL}/barbers`,
  GET_DETAIL: `${BASE_URL}/barbers`,
};

export const ApiHairColor = {
  GET_ALL: `${BASE_URL}/hair-colors`,
  GET_COLOR: `${BASE_URL}/hair-colors/color`,
};

export const ApiHairStyle = {
  GET_ALL: `${BASE_URL}/hair-styles`,
  GET_DETAIL: `${BASE_URL}/hair-styles`,
  GET_IMAGE_URLS: `${BASE_URL}/hair-styles/image-url`,
}

export const ApiUser = {
  LOGIN: `${BASE_URL}/users/authen/login`,
  REGISTER: `${BASE_URL}/users/authen/register`,
  ME: `${BASE_URL}/users/authen/me`,
  LOGOUT: `${BASE_URL}/users/authen/logout`,
  UPDATE_PROFILE: `${BASE_URL}/users`,
  CHANGE_PASSWORD: `${BASE_URL}/users/change-password`,
  FORGOT_PASSWORD: `${BASE_URL}/users/authen/forgot-password`,
  VERIFY_RESET_PASSWORD_TOKEN: `${BASE_URL}/users/authen/verify-reset-password-token`,
  RESET_PASSWORD: `${BASE_URL}/users/authen/reset-password`,
  ADMIN_STATISTIC_QUANTITY: `${BASE_URL}/users/admin/statistic-quantity`,
}

export const ApiFeedback = {
  STATISTICS: `${BASE_URL}/feedbacks/statistics`,
  GET_ALL: `${BASE_URL}/feedbacks`,
  GET_FEEDBACK_BY_ORDER: `${BASE_URL}/feedbacks/order`,
  CREATE_NEW_FEEDBACK: `${BASE_URL}/feedbacks`,
  UPDATE_FEEDBACK: `${BASE_URL}/feedbacks`,
  DELETE_FEEDBACK: `${BASE_URL}/feedbacks`,
}

export const ApiHairFastGan = {
  SWAP_HAIR: `${process.env.NEXT_PUBLIC_HAIR_FAST_GAN_API}/swap-hair`,
}

export const ApiOrder = {
  FIND_ORDER_INFO: `${BASE_URL}/orders/find-order-info`,
  PAYMENT: `${BASE_URL}/orders/payment`,
  GET_ORDER_BY_USER: `${BASE_URL}/orders`,
  GET_ORDER_DETAIL: `${BASE_URL}/orders`,
  ADMIN_STATISTIC_QUANTITY: `${BASE_URL}/orders/admin/statistic-quantity`,
}

export const ApiPayment = {
  VERIFY: `${BASE_URL}/payments/verify`,
  ADMIN_STATISTIC_TOP_ITEM: `${BASE_URL}/payments/admin/statistic-items`,
  ADMIN_STATISTIC_REVENUES: `${BASE_URL}/payments/admin/statistic-revenues`,
}
