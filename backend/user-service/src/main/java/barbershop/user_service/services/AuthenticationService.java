package barbershop.user_service.services;

import barbershop.user_service.dtos.request.LoginRequest;
import barbershop.user_service.dtos.request.RegisterRequest;
import barbershop.user_service.dtos.response.LoginResponse;
import barbershop.user_service.dtos.response.ResponseSuccess;

public interface AuthenticationService {
    LoginResponse login(LoginRequest loginRequest) throws Exception;
    ResponseSuccess logout(String token) throws Exception;
    LoginResponse register(RegisterRequest registerRequest) throws Exception;
    ResponseSuccess test(String email) throws Exception;
}
