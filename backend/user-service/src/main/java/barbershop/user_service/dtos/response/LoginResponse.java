package barbershop.user_service.dtos.response;

import barbershop.user_service.entities.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;

@Getter
@Builder
public class LoginResponse implements Serializable {

    private String token;

    @JsonProperty("user")
    private UserDetailResponse user;
}
