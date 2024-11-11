package barbershop.user_service.controllers;

import barbershop.user_service.dtos.request.*;
import barbershop.user_service.dtos.response.AppBaseResponse;
import barbershop.user_service.dtos.response.LoginResponse;
import barbershop.user_service.dtos.response.ResponseSuccess;
import barbershop.user_service.services.AuthenticationService;
import barbershop.user_service.services.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UserService userService;

    @PostMapping("/authen/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest loginRequest) throws Exception {
        return new ResponseEntity<>(this.authenticationService.login(loginRequest), HttpStatus.OK);
    }

    @GetMapping("/authen/logout")
    public ResponseEntity<ResponseSuccess> logout(
            @RequestParam(value = "token", required = true) String token) throws Exception {
        return new ResponseEntity<>(this.authenticationService.logout(token), HttpStatus.OK);
    }

    @PostMapping("/authen/register")
    public ResponseEntity<LoginResponse> register(@Valid @ModelAttribute RegisterRequest registerRequest) throws Exception {
        return new ResponseEntity<>(this.authenticationService.register(registerRequest), HttpStatus.OK);
    }

    @GetMapping("/authen/test")
    public ResponseEntity<ResponseSuccess> test(@RequestParam("email") String email) throws Exception {
        return new ResponseEntity<>(this.authenticationService.test(email), HttpStatus.OK);
    }

    @GetMapping("/authen/me")
    public ResponseEntity<AppBaseResponse> me(@RequestParam("token") String token) throws Exception {
        return new ResponseEntity<>(this.authenticationService.me(token), HttpStatus.OK);
    }

    @PostMapping("/authen/forgot-password")
    public ResponseEntity<AppBaseResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) throws Exception {
        return new ResponseEntity<>(
                this.authenticationService.forgotPassword(forgotPasswordRequest), HttpStatus.OK
        );
    }

    @GetMapping("/authen/verify-reset-password-token")
    public ResponseEntity<AppBaseResponse> verifyResetPasswordToken(
            @RequestParam(value = "token") String token) throws Exception {
        return new ResponseEntity<>(this.authenticationService.verifyResetPasswordToken(token), HttpStatus.OK);
    }

    @PutMapping("/authen/reset-password")
    public ResponseEntity<AppBaseResponse> resetPassword(
            @RequestBody ResetPasswordRequest resetPasswordRequest
    ) throws Exception {
        return new ResponseEntity<>(this.authenticationService.resetPassword(resetPasswordRequest), HttpStatus.OK);
    }

    @PutMapping("")
    public ResponseEntity<AppBaseResponse> updateProfile(
            @Valid @ModelAttribute UpdateProfileRequest updateProfileRequest,
            HttpServletRequest request) throws Exception {
        updateProfileRequest.setUser((Map<String, Object>) request.getAttribute("user"));
        return new ResponseEntity<>(this.userService.updateProfile(updateProfileRequest), HttpStatus.OK);
    }

    @PutMapping("/change-password")
    public ResponseEntity<AppBaseResponse> changePassword(
            @RequestBody ChangePasswordRequest changePasswordRequest,
            HttpServletRequest request
    ) throws Exception {
        changePasswordRequest.setUser((Map<String, Object>) request.getAttribute("user"));
        return new ResponseEntity<>(this.userService.changePassword(changePasswordRequest), HttpStatus.OK);
    }
}
