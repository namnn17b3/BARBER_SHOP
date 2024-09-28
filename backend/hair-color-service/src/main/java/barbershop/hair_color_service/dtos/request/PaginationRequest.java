package barbershop.hair_color_service.dtos.request;

import barbershop.hair_color_service.dtos.validator.IsBoolean;
import barbershop.hair_color_service.dtos.validator.IsColor;
import barbershop.hair_color_service.dtos.validator.IsInt;
import barbershop.hair_color_service.enums.Color;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PaginationRequest {
    @IsInt()
    private String page = "1";

    @IsInt()
    private String items = "9";

    @IsBoolean
    private String withPagination = "true";

    @IsColor()
    private String color;
}
