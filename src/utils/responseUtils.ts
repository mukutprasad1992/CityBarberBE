import { HttpStatus } from "@nestjs/common";


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



//Error Status
export const ErrorMessage = {

  userAlreadyExists: { message: 'User already exists', statusCode: HttpStatus.BAD_REQUEST },

  passwordMismatch: { message: 'Password and Confirm Password do not match', statusCode: HttpStatus.BAD_REQUEST },

  notFoundUploadedPhoto: { message: 'Please upload a photo', statusCode: HttpStatus.BAD_REQUEST },

  internalServer: { message: 'Internal server error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR },

  userNotFound: { message: 'User not found', statusCode: HttpStatus.NOT_FOUND },

  invalidCredentials: { message: 'Invalid email or password', statusCode: HttpStatus.BAD_REQUEST },

  unauthorizedError: { message: 'Invalid credentials', statusCode: HttpStatus.BAD_REQUEST },

  genericError: { message: 'An unexpected error occurred', statusCode: HttpStatus.BAD_REQUEST },

  passwordResetFailed: { message: 'Unable to reset password at this time' },

  cityNotFound: { message: 'City not found', statusCode: HttpStatus.NOT_FOUND },

  consumerNotFound: { message: 'Consumer not found', statusCode: HttpStatus.NOT_FOUND },

  consumerAlreadyExists: { message: 'Consumer already exists with the given details' },

  userType: { message: 'User does not have the required userType of consumer', statusCode: HttpStatus.BAD_REQUEST },

  providerAlreadyExists: { message: 'Provider already exists with the given details' },

  providerNotFound: { message: 'Provider not found', statusCode: HttpStatus.NOT_FOUND },

  NotProviderUserType: { message: 'User type is not matched', statusCode: HttpStatus.BAD_REQUEST } || { message: "User does not have the required userType for provider creation", statusCode: HttpStatus.BAD_REQUEST },

  countryNotFound: { message: 'Country not found', statusCode: HttpStatus.NOT_FOUND },

  stateNotFound: { message: 'State not found', statusCode: HttpStatus.NOT_FOUND },

  unableToDecodeTheToken: { message: 'Token decoding is missing', statusCode: HttpStatus.UNAUTHORIZED }


};

//Success Status

export const SuccessMessage = {

  userCreated: { message: 'User created successfully', statusCode: HttpStatus.CREATED },

  forgotpasswordMessage: { message: "Link sent successfully", statusCode: HttpStatus.OK },

  getAllUser: { message: 'Fetched all users successfully', statusCode: HttpStatus.OK },

  getUserById: { message: 'Fetch user with given id successfully', statusCode: HttpStatus.OK },

  updateUser: { message: 'User updated successfully', statusCode: HttpStatus.OK },

  deleteUser: { message: 'User deleted successfully', statusCode: HttpStatus.OK },

  userLoggedinSuccessfully: { message: 'Login successfully', statusCode: HttpStatus.OK },

  forgotPasswordMail: { message: "Mail sent successfully", statusCode: HttpStatus.OK },

  passwordResetSuccess: { message: 'Password reset successfully', statusCode: HttpStatus.OK },

  cityAddedSuccessfully: { message: 'City added successfully', statusCode: HttpStatus.CREATED },

  getAllCity: { message: 'All cities fetched successfully', statusCode: HttpStatus.OK },

  getCityById: { message: 'Fetch city with given id successfully', statusCode: HttpStatus.OK },

  updateCity: { message: 'City updated successfully', statusCode: HttpStatus.OK },

  deleteCity: { message: 'City deleted successfully', statusCode: HttpStatus.OK },

  stateAddedSuccessfully: { message: 'State added successfully', statusCode: HttpStatus.CREATED },

  getAllState: { message: 'All states fetched successfully', statusCode: HttpStatus.OK },

  getStateById: { message: 'Fetched state with given id successfully', statusCode: HttpStatus.OK },

  updateState: { message: 'State updated successfully', statusCode: HttpStatus.OK },

  deleteState: { message: 'State deleted successfully', statusCode: HttpStatus.OK },

  countryAddedSuccessfully: { message: 'Country added successfully', statusCode: HttpStatus.CREATED },

  getAllCountries: { message: 'All countries fetched successfully', statusCode: HttpStatus.OK },

  getCountryById: { message: 'Fetched conutry with given id successfully', statusCode: HttpStatus.OK },

  updateCountry: { message: 'Country updated successfully', statusCode: HttpStatus.OK },

  deleteCountry: { message: 'Country deleted successfully', statusCode: HttpStatus.OK },

  consumerCreatedSuccessfully: { message: 'Consumer added successfully', statusCode: HttpStatus.CREATED },

  getAllConsumers: { message: 'All consumers fetched successfully', statusCode: HttpStatus.OK },

  getConsumersById: { message: 'Fetched consumer with given id successfully', statusCode: HttpStatus.OK },

  updateConsumer: { message: 'Consumer updated successfully', statusCode: HttpStatus.OK },

  deleteConsumer: { message: 'Consumer deleted successfully', statusCode: HttpStatus.OK },

  consumerProfile: { message: 'Profile fetched successfully', statusCode: HttpStatus.OK },

  providerCreatedSuccessfully: { message: 'Consumer added successfully', statusCode: HttpStatus.CREATED },

  getAllProviders: { message: 'All Providers fetched successfully', statusCode: HttpStatus.OK },

  getProvidersById: { message: 'Fetched provider with given id successfully', statusCode: HttpStatus.OK },

  updateProvider: { message: 'Provider updated successfully', statusCode: HttpStatus.OK },

  deleteProvider: { message: 'Provider deleted successfully', statusCode: HttpStatus.OK },
};
