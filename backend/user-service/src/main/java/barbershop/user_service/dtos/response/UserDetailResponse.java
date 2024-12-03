package barbershop.user_service.dtos.response;

import barbershop.user_service.enums.Gender;
import barbershop.user_service.enums.Role;
import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;

@Builder
@Getter
public class UserDetailResponse implements Serializable {
    private Integer id;

    private String username;

    private String email;

    private String phone;

    private Gender gender;

    private String address;

    private String avatar;

    private Role role;

    private boolean active;
}
