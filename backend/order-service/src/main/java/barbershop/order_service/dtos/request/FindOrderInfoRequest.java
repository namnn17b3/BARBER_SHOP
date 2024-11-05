package barbershop.order_service.dtos.request;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class FindOrderInfoRequest {
    private String date;
    private String time;
    private int hairStyleId;
    private int hairColorId;
    private int barberId;
    private Map<String, Object> user;
}
