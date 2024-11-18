package barbershop.user_service.dtos.request;

import barbershop.user_service.dtos.validator.IsInt;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StatisticQuantityRequest {
    @IsInt()
    private String month;

    @IsInt()
    private String year;
}
