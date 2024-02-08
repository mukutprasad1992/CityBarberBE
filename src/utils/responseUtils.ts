export const createSuccessResponse = (data: any, message = 'Success', token?: string) => ({
  success: true,
  message,
  data,
});

export const createErrorResponse = (message: string, error?: any, data?: any) => ({
  success: false,
  message,
  error,
});

//Timing Success Messages

export const TIMING_CREATE_SUCCESS = 'Timings created successfully';
export const TIMING_UPDATE_SUCCESS = 'Timing updated successfully';
export const TIMING_GET_ID_SUCCESS = 'Timing fetched successfully';
export const TIMING_GET_All_SUCCESS = 'All Timings fetched successfully';
export const TIMING_DELETED_SUCCESS = 'Timing Deleted successfully';

//Seat Success Messages
export const SEAT_CREATE_SUCCESS = 'seats created successfully';
export const SEAT_UPDATE_SUCCESS = 'seats updated successfully';
export const SEAT_GET_ID_SUCCESS = 'seat fetched successfully';
export const SEAT_GET_All_SUCCESS = 'All seats fetched successfully';
export const SEAT_DELETED_SUCCESS = 'seat Deleted successfully';

//Shop Success Messages
export const SHOP_CREATE_SUCCESS = 'shop created successfully';
export const SHOP_UPDATE_SUCCESS = 'shop updated successfully';
export const SHOP_GET_ID_SUCCESS = 'shop fetched successfully';
export const SHOP_GET_All_SUCCESS = 'All shop fetched successfully';
export const SHOP_DELETED_SUCCESS = 'shop Deleted successfully';

//Provider Success Messages
export const PROVIDER_CREATE_SUCCESS = 'Provider created successfully';
export const PROVIDER_UPDATE_SUCCESS = 'Provider updated successfully';
export const PROVIDER_GET_ID_SUCCESS = 'Provider fetched successfully';
export const PROVIDER_GET_All_SUCCESS = 'All Providers fetched successfully';
export const PROVIDER_DELETED_SUCCESS = 'Provider Deleted successfully';

//User Success Messages
export const USER_CREATE_SUCCESS = 'User created successfully';
export const USER_UPDATE_SUCCESS = 'User updated successfully';
export const USER_GET_ID_SUCCESS = 'User fetched successfully';
export const USER_GET_All_SUCCESS = 'All Users fetched successfully';
export const USER_DELETED_SUCCESS = 'User Deleted successfully';
