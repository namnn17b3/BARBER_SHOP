package barbershop.user_service.dtos.request;

import lombok.*;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordRequest {
    private String newPassword;
    private String confirmPassword;
    private String token;
}
