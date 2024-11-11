package barbershop.user_service.services.impl;

import barbershop.user_service.dtos.request.ChangePasswordRequest;
import barbershop.user_service.dtos.request.FieldErrorsResponse;
import barbershop.user_service.dtos.request.UpdateProfileRequest;
import barbershop.user_service.dtos.response.AppBaseResponse;
import barbershop.user_service.dtos.response.UserDetailResponse;
import barbershop.user_service.entities.User;
import barbershop.user_service.enums.Gender;
import barbershop.user_service.repositories.UserRepository;
import barbershop.user_service.securities.Bcrypt;
import barbershop.user_service.services.S3StorageService;
import barbershop.user_service.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService {
    @Value("${application.folder-name}")
    private String folderName;

    @Value("${application.base-url}")
    private String baseUrl;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private S3StorageService s3StorageService;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    @Override
    public AppBaseResponse updateProfile(UpdateProfileRequest updateProfileRequest) throws Exception {
        User user = User.builder()
                .username(updateProfileRequest.getUsername())
                .phone(updateProfileRequest.getPhone())
                .address(updateProfileRequest.getAddress())
                .gender(Gender.valueOf(updateProfileRequest.getGender()))
                .avatar(null)
                .build();

        Map<String, Object> userMap = updateProfileRequest.getUser();
        user.setId((int) userMap.get("id"));
        User oldUser = userRepository.findById(user.getId()).orElse(null);
        user.setAvatar(oldUser.getAvatar());

        if (updateProfileRequest.getAvatar() != null && !updateProfileRequest.getAvatar().isEmpty()) {
            if (oldUser.getAvatar() != null) {
                String fileName = oldUser.getAvatar().replaceAll(baseUrl + folderName + "/", "").trim();
                System.out.println(">>>> fileName : " + fileName);
                this.s3StorageService.deleteFile(fileName);
            }
            String avatar = this.s3StorageService.uploadFile(updateProfileRequest.getAvatar());
            System.out.println(">>>>> avatar : " + avatar);
            user.setAvatar(avatar);
        }

        if (updateProfileRequest.getAvatar() != null && updateProfileRequest.getAvatar().isEmpty()) {
            user.setAvatar(null);
        }

        userRepository.updateUserProfile(user);
        entityManager.clear();

        User userUpdated = userRepository.findById(user.getId()).orElse(null);
        System.out.println(">>>>> username after update : " + userUpdated.getUsername());
        UserDetailResponse userDetailResponse = UserDetailResponse.builder()
                .id(userUpdated.getId())
                .username(userUpdated.getUsername())
                .email(userUpdated.getEmail())
                .address(userUpdated.getAddress())
                .phone(userUpdated.getPhone())
                .role(userUpdated.getRole())
                .gender(userUpdated.getGender())
                .avatar(userUpdated.getAvatar())
                .build();

        return AppBaseResponse.builder()
                .data(userDetailResponse)
                .build();
    }

    @Transactional
    @Override
    public AppBaseResponse changePassword(ChangePasswordRequest changePasswordRequest) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();

        Map<String, Object> userMap = changePasswordRequest.getUser();
        User user = userRepository.findById((int) userMap.get("id")).orElse(null);
        if (!Bcrypt.checkpw(changePasswordRequest.getOldPassword(), user.getPassword())) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("Old password")
                            .message("Old password not match")
                            .resource("ChangePasswordRequest")
                            .build()
            );

            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        String regex = "^.{8,}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(changePasswordRequest.getNewPassword());
        if (!matcher.matches()) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("New password")
                            .message("New password must be at least 8 characters")
                            .resource("ChangePasswordRequest")
                            .build()
            );

            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        if (changePasswordRequest.getConfirmPassword() == null ||
            (!changePasswordRequest.getConfirmPassword().equals(changePasswordRequest.getNewPassword())))
        {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("Confirm password")
                            .message("Confirm password not match")
                            .resource("ChangePasswordRequest")
                            .build()
            );

            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        userRepository.changePasswordById(Bcrypt.hashpw(changePasswordRequest.getNewPassword()), user.getId());
        entityManager.clear();

        Map<String, Object> map = Map.of("message", "Change password successfully");
        return new AppBaseResponse(map);
    }
}
