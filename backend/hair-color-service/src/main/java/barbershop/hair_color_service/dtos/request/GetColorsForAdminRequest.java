package barbershop.hair_color_service.dtos.request;

import barbershop.hair_color_service.dtos.validator.IsInt;
import lombok.*;


@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GetColorsForAdminRequest {
    @IsInt()
    private String page = "1";

    @IsInt()
    private String items = "9";

    private String keyword;
}
