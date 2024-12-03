package barbershop.user_service.services;

import barbershop.user_service.dtos.request.*;
import barbershop.user_service.dtos.response.AppBaseResponse;
import barbershop.user_service.dtos.response.PaginationResponse;

public interface UserService {
    AppBaseResponse updateProfile(UpdateProfileRequest updateProfileRequest) throws Exception;
    AppBaseResponse changePassword(ChangePasswordRequest changePasswordRequest) throws Exception;
    AppBaseResponse statisticQuantity(StatisticQuantityRequest statisticQuantityRequest) throws Exception;
    PaginationResponse getListUserForAdmin(GetListUserForAdminRequest getListUserForAdminRequest) throws Exception;
    AppBaseResponse getDetailUserForAdmin(String userId) throws Exception;
    AppBaseResponse updateStatusUserByAdmin(String userId, UpdateStatusUserRequest updateStatusUserRequest) throws Exception;
}
