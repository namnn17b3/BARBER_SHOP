package barbershop.user_service.dtos.request;

import barbershop.user_service.dtos.validator.GenderSubset;
import barbershop.user_service.dtos.validator.PhoneNumber;
import barbershop.user_service.enums.Gender;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import java.util.Map;

@Slf4j
@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileRequest {
    @SafeHtml
    @NotBlank(message = "Username must be not blank")
    private String username;

    @SafeHtml
    @PhoneNumber(message = "Phone invalid format")
    private String phone;

    @SafeHtml
    @NotBlank(message = "Address must be not blank")
    private String address;

    @GenderSubset(anyOf = {Gender.MALE, Gender.FEMALE, Gender.OTHER})
    private String gender;

    private MultipartFile avatar;

    private Map<String, Object> user;
}
