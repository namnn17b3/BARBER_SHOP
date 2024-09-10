package barbershop.user_service.controllers;

import barbershop.user_service.dtos.request.LoginRequest;
import barbershop.user_service.dtos.request.RegisterRequest;
import barbershop.user_service.dtos.response.LoginResponse;
import barbershop.user_service.dtos.response.ResponseSuccess;
import barbershop.user_service.services.AuthenticationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/api/user")
public class AuthenController {
    @Autowired
    private AuthenticationService authenticationService;

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
}
