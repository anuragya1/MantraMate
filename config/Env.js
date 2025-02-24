import {
    API_BASE_URL,
    API_VERSION,
    API_ENDPOINTS_SERVICE,
    API_ENDPOINTS_PANDIT,
    API_ENDPOINTS_PANDIT_LOGIN,
    API_ENDPOINTS_CATEGORY,
    API_ENDPOINTS_SEND_OTP,
    API_ENDPOINTS_GET_PRESIGNED,
    API_ENDPOINTS_GENERATE_PRESIGNED

  } from '@env';
  

  export const BASE_URL = `${API_BASE_URL}${API_VERSION}`;
  export const SERVICE_URL = `${BASE_URL}${API_ENDPOINTS_SERVICE}`;
  export const PANDIT_URL = `${BASE_URL}${API_ENDPOINTS_PANDIT}`;
  export const PANDIT_LOGIN_URL = `${BASE_URL}${API_ENDPOINTS_PANDIT_LOGIN}`;
  export const CATEGORY_URL = `${BASE_URL}${API_ENDPOINTS_CATEGORY}`;
  export const SEND_OTP_URL = `${BASE_URL}${API_ENDPOINTS_SEND_OTP}`;
  export const GENERATE_PRESIGNED_URL = `${BASE_URL}${API_ENDPOINTS_GENERATE_PRESIGNED}`;
  export const GET_PRESIGNED_URL = `${BASE_URL}${API_ENDPOINTS_GET_PRESIGNED}`;