package barbershop.user_service.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Role {
    @JsonProperty("admin")
    ADMIN,

    @JsonProperty("user")
    USER
}
