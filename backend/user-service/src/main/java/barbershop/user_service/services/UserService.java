package barbershop.user_service.services;

import barbershop.user_service.dtos.request.ChangePasswordRequest;
import barbershop.user_service.dtos.request.UpdateProfileRequest;
import barbershop.user_service.dtos.response.AppBaseResponse;

public interface UserService {
    AppBaseResponse updateProfile(UpdateProfileRequest updateProfileRequest) throws Exception;
    AppBaseResponse changePassword(ChangePasswordRequest changePasswordRequest) throws Exception;
}
