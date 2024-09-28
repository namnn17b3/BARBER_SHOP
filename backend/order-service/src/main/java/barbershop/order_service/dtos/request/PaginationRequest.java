package barbershop.order_service.dtos.request;

import barbershop.order_service.dtos.validator.IsBoolean;
import barbershop.order_service.dtos.validator.IsInt;
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
}
