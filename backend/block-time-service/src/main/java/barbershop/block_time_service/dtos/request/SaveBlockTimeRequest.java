package barbershop.block_time_service.dtos.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SaveBlockTimeRequest {
    String date;
    String time;
}
