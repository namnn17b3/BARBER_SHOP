package barbershop.user_service.services.impl;

import barbershop.user_service.dtos.request.*;
import barbershop.user_service.dtos.response.AppBaseResponse;
import barbershop.user_service.dtos.response.PaginationResponse;
import barbershop.user_service.dtos.response.UserDetailResponse;
import barbershop.user_service.entities.User;
import barbershop.user_service.enums.Gender;
import barbershop.user_service.enums.Role;
import barbershop.user_service.enums.TimeZone;
import barbershop.user_service.exception.ResourceNotFoundException;
import barbershop.user_service.repositories.UserRepository;
import barbershop.user_service.securities.Bcrypt;
import barbershop.user_service.services.S3StorageService;
import barbershop.user_service.services.UserService;
import barbershop.user_service.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.LinkedHashMap;
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
                String fileName = oldUser.getAvatar().replaceAll(baseUrl, "").trim();
                System.out.println(">>>> fileName : " + fileName);
                this.s3StorageService.deleteFile(fileName);
            }
            String avatar = this.s3StorageService.uploadFile(updateProfileRequest.getAvatar());
            System.out.println(">>>>> avatar : " + avatar);
            user.setAvatar(avatar);
        }

        if (updateProfileRequest.getAvatar() != null && updateProfileRequest.getAvatar().isEmpty()) {
            if (oldUser.getAvatar() != null) {
                String fileName = oldUser.getAvatar().replaceAll(baseUrl, "").trim();
                System.out.println(">>>> fileName : " + fileName);
                this.s3StorageService.deleteFile(fileName);
            }
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

    @Override
    public AppBaseResponse statisticQuantity(StatisticQuantityRequest statisticQuantityRequest) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();
        if (Utils.parseDate(statisticQuantityRequest.getYear()+"-"+statisticQuantityRequest.getMonth()+"-01 00:00:00", "yyyy-MM-dd HH:mm:ss", TimeZone.ASIA_HCM.value()) == null) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("month and year")
                            .message("Invalid date format")
                            .resource("StatisticQuantityRequest")
                            .build()
            );

            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        int quantityCurrent = this.userRepository.statisticQuantity(
                Integer.parseInt(statisticQuantityRequest.getMonth()),
                Integer.parseInt(statisticQuantityRequest.getYear())
        );
        String yyyyMMPrevious = Utils.getPreviousMonth(
                statisticQuantityRequest.getYear()+"-"+statisticQuantityRequest.getMonth(),
                "yyyy-MM-dd",
                TimeZone.ASIA_HCM.value()
        );
        int yyyyPrevious = Integer.parseInt(yyyyMMPrevious.split("-")[0]);
        int mmPrevious = Integer.parseInt(yyyyMMPrevious.split("-")[1]);
        int quantityPrevious = this.userRepository.statisticQuantity(
                mmPrevious,
                yyyyPrevious
        );

        return new AppBaseResponse(Map.of(
                "yyyyMM", statisticQuantityRequest.getYear()+"-"+statisticQuantityRequest.getMonth(),
                "quantityCurrent", quantityCurrent,
                "quantityPrevious", quantityPrevious
        ));
    }

    @Override
    public PaginationResponse getListUserForAdmin(GetListUserForAdminRequest getListUserForAdminRequest) throws Exception{
        List<User> users = userRepository.getListUserForAdmin(getListUserForAdminRequest);
        List<Map<String, Object>> userMaps = new ArrayList<>();
        for (User user : users) {
            Map<String, Object> userMap = new LinkedHashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("gender", user.getGender());
            userMap.put("avatar", user.getAvatar());
            userMap.put("active", user.isActive());

            userMaps.add(userMap);
        }

        int page = Integer.parseInt(getListUserForAdminRequest.getPage());
        int items = Integer.parseInt(getListUserForAdminRequest.getItems());

        int totalRecords = userRepository.countUserForAdmin(getListUserForAdminRequest);

        PaginationResponse paginationResponse = new PaginationResponse();
        paginationResponse.setMeta(
                PaginationResponse.Meta.builder()
                        .items(items)
                        .page(page)
                        .totalRecords(totalRecords)
                        .build()
        );

        paginationResponse.setData(userMaps);

        return paginationResponse;
    }

    @Override
    public AppBaseResponse getDetailUserForAdmin(String userId) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();
        int id = 0;
        try {
            id = Integer.parseInt(userId);
        } catch (Exception exception) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("User id")
                            .message("User id is invalid integer format")
                            .resource("Path variable")
                            .build()
            );

            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }
        User user = userRepository.findByIdAndRole(id, Role.USER).orElse(null);

        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }

        Map<String, Object> userMap = new LinkedHashMap<>();
        userMap.put("id", user.getId());
        userMap.put("username", user.getUsername());
        userMap.put("email", user.getEmail());
        userMap.put("gender", user.getGender());
        userMap.put("avatar", user.getAvatar());
        userMap.put("phone", user.getPhone());
        userMap.put("address", user.getAddress());
        userMap.put("active", user.isActive());

        return new AppBaseResponse(userMap);
    }

    @Override
    public AppBaseResponse updateStatusUserByAdmin(String userId, UpdateStatusUserRequest updateStatusUserRequest) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();
        int id = 0;
        try {
            id = Integer.parseInt(userId);
        } catch (Exception exception) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("User id")
                            .message("User id is invalid integer format")
                            .resource("Path variable")
                            .build()
            );

            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }
        User user = userRepository.findByIdAndRole(id, Role.USER).orElse(null);

        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }

        if (updateStatusUserRequest.getActive() == null) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("Active")
                            .message("Required active field is mandatory")
                            .resource("Request body")
                            .build()
            );

            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        user.setActive(updateStatusUserRequest.getActive());
        userRepository.save(user);

        return new AppBaseResponse(Map.of("message", "Change status successfully"));
    }
}
