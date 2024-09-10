package barbershop.user_service.dtos.request;

import lombok.*;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    @NotBlank(message = "email must be not blank")
    private String email;

    @NotBlank(message = "password must be not blank")
    private String password;
}
