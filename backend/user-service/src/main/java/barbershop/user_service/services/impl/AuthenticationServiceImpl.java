package barbershop.user_service.services.impl;

import barbershop.user_service.dtos.request.*;
import barbershop.user_service.dtos.response.AppBaseResponse;
import barbershop.user_service.dtos.response.LoginResponse;
import barbershop.user_service.dtos.response.ResponseSuccess;
import barbershop.user_service.dtos.response.UserDetailResponse;
import barbershop.user_service.entities.User;
import barbershop.user_service.enums.Gender;
import barbershop.user_service.exception.HttpException;
import barbershop.user_service.repositories.UserRepository;
import barbershop.user_service.securities.Bcrypt;
import barbershop.user_service.securities.Hash;
import barbershop.user_service.services.AuthenticationService;
import barbershop.user_service.services.JwtService;
import barbershop.user_service.services.RedisService;
import barbershop.user_service.services.S3StorageService;
import barbershop.user_service.utils.Utils;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
public class AuthenticationServiceImpl extends AuthenticationService {
    @Value("${jwt.expire}")
    private String expire;

    @Value("${forgot-password.expire}")
    private String forgotPasswordExpire;

    @Value("${forgot-password.secret}")
    private String forgotPasswordSecret;

    @Value("${server-info.domain}")
    private String serverDomain;

    @Value("${server-info.protocol}")
    private String serverProtocol;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RedisService redisService;

    @Autowired
    private S3StorageService s3StorageService;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public LoginResponse login(LoginRequest loginRequest) throws Exception {
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);
        if (user == null) {
            throw new HttpException("Email is incorrect", HttpStatus.UNAUTHORIZED.value());
        }
        if (!Bcrypt.checkpw(loginRequest.getPassword(), user.getPassword())) {
            throw new HttpException("Password incorrect", HttpStatus.UNAUTHORIZED.value());
        }
        if (!user.isActive()) {
            throw new HttpException("Account is locked", HttpStatus.UNAUTHORIZED.value());
        }
        if (this.redisService.getValue("u_"+user.getId()) != null) {
            throw new HttpException("Account access any where", HttpStatus.UNAUTHORIZED.value());
        }
        String token = this.jwtService.generateToken(user.getId());
        this.redisService.setValue("u_"+user.getId(), token, Long.parseLong(expire), TimeUnit.MILLISECONDS);
        return LoginResponse.builder()
                .token(token)
                .user(UserDetailResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .address(user.getAddress())
                        .phone(user.getPhone())
                        .role(user.getRole())
                        .gender(user.getGender())
                        .avatar(user.getAvatar())
                        .build())
                .build();
    }

    @Override
    public ResponseSuccess logout(String token) throws Exception {
        try {
            JwtService.PayLoad payLoad = this.jwtService.extractToken(token);
            String validToken = this.redisService.getValue("u_"+payLoad.getId());
            if (validToken != null && !validToken.equals(token)) {
                throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED.value());
            }
            this.redisService.deleteKey("u_"+payLoad.getId());
            return new ResponseSuccess(HttpStatus.OK, "Logout Success");
        } catch (Exception exception) {
            log.error("ERROR", exception);
            throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED.value());
        }
    }

    @Transactional
    @Override
    public LoginResponse register(RegisterRequest registerRequest) throws Exception {
        if (this.userRepository.findByEmail(registerRequest.getEmail()).orElse(null) != null) {
            throw new HttpException("Email already in use", HttpStatus.UNAUTHORIZED.value());
        }
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(Bcrypt.hashpw(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        user.setAddress(registerRequest.getAddress());
        user.setGender(Gender.valueOf(registerRequest.getGender()));
        user.setActive(true);

        if (registerRequest.getAvatar() != null && !registerRequest.getAvatar().isEmpty()) {
            String avatar = this.s3StorageService.uploadFile(registerRequest.getAvatar());
            user.setAvatar(avatar);
        }

        this.userRepository.save(user);
        String token = this.jwtService.generateToken(user.getId());
        this.redisService.setValue("u_"+user.getId(), token, Long.parseLong(expire), TimeUnit.MILLISECONDS);

        UserDetailResponse userDetailResponse = UserDetailResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .address(user.getAddress())
                .phone(user.getPhone())
                .role(user.getRole())
                .gender(user.getGender())
                .avatar(user.getAvatar())
                .active(user.isActive())
                .build();

        // Emit event send mail to notification-service by Kafka
        this.kafkaTemplate.send("send-email-register",
                this.objectMapper.writeValueAsString(userDetailResponse));

        return LoginResponse.builder()
                .token(token)
                .user(userDetailResponse)
                .build();
    }

    @Override
    public ResponseSuccess test(String email) throws Exception {
        try {
            User user = this.userRepository.findByEmail(email).orElse(null);
            String token = this.jwtService.generateToken(user.getId());
            UserDetailResponse userDetailResponse = UserDetailResponse.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .address(user.getAddress())
                    .phone(user.getPhone())
                    .role(user.getRole())
                    .gender(user.getGender())
                    .avatar(user.getAvatar())
                    .build();

            LoginResponse loginResponse = LoginResponse.builder()
                    .token(token)
                    .user(userDetailResponse)
                    .build();

            this.kafkaTemplate.send("send-email-register",
                    this.objectMapper.writeValueAsString(userDetailResponse));

            return new ResponseSuccess(HttpStatus.OK, "Success");
        } catch (Exception exception) {
            log.error("ERROR", exception);
            throw exception;
        }
    }

    @Override
    public AppBaseResponse me(String token) throws Exception {
        try {
            JwtService.PayLoad payLoad = this.jwtService.extractToken(token);
            String validToken = this.redisService.getValue("u_"+payLoad.getId());
            if (validToken == null || !validToken.equals(token)) {
                throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED.value());
            }
            User user = this.userRepository.findById(payLoad.getId()).orElse(null);
            if (user == null) {
                throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED.value());
            }
            if (!user.isActive()) {
                throw new HttpException("Account is locked", HttpStatus.UNAUTHORIZED.value());
            }

            UserDetailResponse userDetailResponse = UserDetailResponse.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .address(user.getAddress())
                    .phone(user.getPhone())
                    .role(user.getRole())
                    .gender(user.getGender())
                    .avatar(user.getAvatar())
                    .build();

            return AppBaseResponse.builder()
                    .data(userDetailResponse)
                    .build();
        } catch (Exception exception) {
            log.error("ERROR", exception);
            throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED.value());
        }
    }

    @Override
    public AppBaseResponse forgotPassword(ForgotPasswordRequest forgotPasswordRequest) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();

        User user = this.userRepository.findByEmail(forgotPasswordRequest.getEmail()).orElse(null);
        if (user == null) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("email")
                            .message("Email not found")
                            .resource("ForgotPasswordRequest")
                            .build()
            );

            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }
        if (!user.isActive()) {
            throw new HttpException("Account is locked", HttpStatus.UNAUTHORIZED.value());
        }

        if (this.redisService.getValue("fp_"+forgotPasswordRequest.getEmail()) != null) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("email")
                            .message("Cannot proceed because password is being reset")
                            .resource("ForgotPasswordRequest")
                            .build()
            );

            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        String headerBase64Encode = Base64.getEncoder().encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));
        String payload = this.objectMapper.writeValueAsString(AuthenticationService.PayLoad
                .builder()
                .email(forgotPasswordRequest.getEmail())
                .iat(System.currentTimeMillis())
                .exp(System.currentTimeMillis() + Long.parseLong(forgotPasswordExpire))
                .build());
        String payloadBase64Encode = Base64.getEncoder().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String signature = Hash.hmacSha256(headerBase64Encode + "." + payloadBase64Encode, forgotPasswordSecret);
        String token = headerBase64Encode + "." + payloadBase64Encode + "." + signature;

        String url = serverProtocol+"://"+serverDomain+"/authen/reset-password?token="+Utils.encodeURIComponent(token);

        this.redisService.setValue("fp_"+user.getEmail(), token, Long.parseLong(forgotPasswordExpire), TimeUnit.MILLISECONDS);
        this.kafkaTemplate.send("send-email-reset-password",
                this.objectMapper.writeValueAsString(Map.of("email", user.getEmail(), "url", url)));

        // return new AppBaseResponse(url);
       return new AppBaseResponse(Map.of("message", "Success"));
    }

    @Override
    public AppBaseResponse verifyResetPasswordToken(String token) throws Exception {
        try {
            String regex = "^([^.]+)\\.([^.]+)\\.([^.]+)$";
            Pattern pattern = Pattern.compile(regex);
            Matcher matcher = pattern.matcher(token);
            if (matcher.matches()) {
                String payload = new String(Base64.getDecoder().decode(matcher.group(2).getBytes(StandardCharsets.UTF_8)),
                        StandardCharsets.UTF_8);

                AuthenticationService.PayLoad payLoad = this.objectMapper.readValue(payload, AuthenticationService.PayLoad.class);
                String correctToken = this.redisService.getValue("fp_"+payLoad.getEmail());
                User user = this.userRepository.findByEmail(payLoad.getEmail()).orElse(null);
                if (user == null) {
                    throw new HttpException("User not found", HttpStatus.UNAUTHORIZED.value());
                }
                if (!user.isActive()) {
                    throw new HttpException("Account is locked", HttpStatus.UNAUTHORIZED.value());
                }
                if (correctToken == null) {
                    return new AppBaseResponse(Map.of(
                            "message", "Password reseted or token expired",
                            "email", payLoad.getEmail(),
                            "code", 2
                    ));
                }
                if (!token.equals(correctToken)) {
                    return new AppBaseResponse(Map.of(
                            "message", "Invalid token",
                            "code", 1
                    ));
                }
                return new AppBaseResponse(Map.of(
                        "message", "OK",
                        "email", payLoad.getEmail(),
                        "code", 0
                ));
            }
        } catch (Exception exception) {
            log.error("ERROR", exception);
        }

        return new AppBaseResponse(Map.of("message", "Invalid token", "code", 1));
    }

    @Transactional
    @Override
    public AppBaseResponse resetPassword(ResetPasswordRequest resetPasswordRequest) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();

        Map<String, Object> verifyResetPasswordTokenResult = (Map<String, Object>) verifyResetPasswordToken(resetPasswordRequest.getToken()).getData();
        String email = verifyResetPasswordTokenResult.get("email").toString();
        User user = this.userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            throw new HttpException("User not found", HttpStatus.UNAUTHORIZED.value());
        }
        if (!user.isActive()) {
            throw new HttpException("Account is locked", HttpStatus.UNAUTHORIZED.value());
        }
        if ((int) verifyResetPasswordTokenResult.get("code") != 0) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("token")
                            .message(verifyResetPasswordTokenResult.get("message").toString())
                            .resource("ResetPasswordRequest")
                            .build()
            );

            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        String regex = "^.{8,}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(resetPasswordRequest.getNewPassword());
        if (!matcher.matches()) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("New password")
                            .message("New password must be at least 8 characters")
                            .resource("ResetPasswordRequest")
                            .build()
            );

            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        if (resetPasswordRequest.getConfirmPassword() == null ||
            (!resetPasswordRequest.getConfirmPassword().equals(resetPasswordRequest.getNewPassword())))
        {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("Confirm password")
                            .message("Confirm password not match")
                            .resource("ResetPasswordRequest")
                            .build()
            );

            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        userRepository.changePasswordByEmail(Bcrypt.hashpw(resetPasswordRequest.getNewPassword()), email);
        entityManager.clear();

        this.redisService.deleteKey("fp_"+email);

        Map<String, Object> map = Map.of("message", "Reset password successfully");
        return new AppBaseResponse(map);
    }
}
