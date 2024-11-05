package barbershop.user_service.services.impl;

import barbershop.user_service.dtos.request.LoginRequest;
import barbershop.user_service.dtos.request.RegisterRequest;
import barbershop.user_service.dtos.response.AppBaseResponse;
import barbershop.user_service.dtos.response.LoginResponse;
import barbershop.user_service.dtos.response.ResponseSuccess;
import barbershop.user_service.dtos.response.UserDetailResponse;
import barbershop.user_service.entities.User;
import barbershop.user_service.enums.Gender;
import barbershop.user_service.exception.HttpException;
import barbershop.user_service.exception.ResourceNotFoundException;
import barbershop.user_service.repositories.UserRepository;
import barbershop.user_service.securities.Bcrypt;
import barbershop.user_service.services.AuthenticationService;
import barbershop.user_service.services.JwtService;
import barbershop.user_service.services.RedisService;
import barbershop.user_service.services.S3StorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class AuthenticationServiceImpl implements AuthenticationService {
    @Value("${jwt.expire}")
    private String expire;

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

    @Override
    public LoginResponse login(LoginRequest loginRequest) throws Exception {
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);
        if (user == null) {
            throw new HttpException("Email is incorrect", HttpStatus.UNAUTHORIZED.value());
        }
        if (!Bcrypt.checkpw(loginRequest.getPassword(), user.getPassword())) {
            throw new HttpException("Password incorrect", HttpStatus.UNAUTHORIZED.value());
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
        user.setPassword(registerRequest.getPassword());
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        user.setAddress(registerRequest.getAddress());
        user.setGender(Gender.valueOf(registerRequest.getGender()));

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
}
