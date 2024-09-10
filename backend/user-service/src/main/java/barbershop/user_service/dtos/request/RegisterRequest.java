package barbershop.user_service.dtos.request;

import barbershop.user_service.dtos.validator.GenderSubset;
import barbershop.user_service.dtos.validator.PhoneNumber;
import barbershop.user_service.enums.Gender;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Slf4j
@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @SafeHtml
    @NotBlank(message = "Username must be not blank")
    private String username;

    @Pattern(regexp = "^.{8,}$", message = "Password must be at least 8 characters")
    private String password;

    @SafeHtml
    @Email(message = "Email invalid format")
    private String email;

    @SafeHtml
    @PhoneNumber(message = "Phone invalid format")
    private String phone;

    @SafeHtml
    @NotBlank(message = "Address must be not blank")
    private String address;

    @GenderSubset(anyOf = {Gender.MALE, Gender.FEMALE, Gender.OTHER})
    private String gender;

    private MultipartFile avatar;
}
