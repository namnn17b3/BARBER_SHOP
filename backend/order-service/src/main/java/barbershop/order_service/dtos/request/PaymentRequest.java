package barbershop.order_service.dtos.request;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PaymentRequest {
    private String date;
    private String time;
    private int hairStyleId;
    private int hairColorId;
    private Map<String, Object> user;
    private int barberId;
    private String paymentType;
}
