package barbershop.user_service.dtos.request;

import barbershop.user_service.dtos.validator.GenderSubset;
import barbershop.user_service.dtos.validator.IsBoolean;
import barbershop.user_service.enums.Gender;
import lombok.*;;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GetListUserForAdminRequest extends PaginationRequest {
    private String keyword;

    @GenderSubset(anyOf = {Gender.MALE, Gender.FEMALE, Gender.OTHER})
    private String gender;

    @IsBoolean
    private String active;

    private Map<String, Object> user;
}
