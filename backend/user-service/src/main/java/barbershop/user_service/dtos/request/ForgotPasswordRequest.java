package barbershop.user_service.dtos.request;

import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.constraints.SafeHtml;

import javax.validation.constraints.Email;

@Slf4j
@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ForgotPasswordRequest {
    @SafeHtml
    @Email(message = "Email invalid format")
    String email;
}
