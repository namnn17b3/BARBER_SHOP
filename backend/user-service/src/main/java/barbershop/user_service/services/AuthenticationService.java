package barbershop.user_service.services;

import barbershop.user_service.dtos.request.ForgotPasswordRequest;
import barbershop.user_service.dtos.request.LoginRequest;
import barbershop.user_service.dtos.request.RegisterRequest;
import barbershop.user_service.dtos.request.ResetPasswordRequest;
import barbershop.user_service.dtos.response.AppBaseResponse;
import barbershop.user_service.dtos.response.LoginResponse;
import barbershop.user_service.dtos.response.ResponseSuccess;
import lombok.*;

public abstract class AuthenticationService {
    @Data
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @ToString(of = {"email", "iat", "exp"})
    public static class PayLoad {
        private String email;
        private long iat;
        private long exp;
    }

    public abstract LoginResponse login(LoginRequest loginRequest) throws Exception;
    public abstract ResponseSuccess logout(String token) throws Exception;
    public abstract LoginResponse register(RegisterRequest registerRequest) throws Exception;
    public abstract ResponseSuccess test(String email) throws Exception;
    public abstract AppBaseResponse me(String token) throws Exception;
    public abstract AppBaseResponse forgotPassword(ForgotPasswordRequest forgotPasswordRequest) throws Exception;
    public abstract AppBaseResponse verifyResetPasswordToken(String token) throws Exception;
    public abstract AppBaseResponse resetPassword(ResetPasswordRequest resetPasswordRequest) throws Exception;
}
