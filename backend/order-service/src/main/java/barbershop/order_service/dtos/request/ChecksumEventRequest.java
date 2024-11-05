package barbershop.order_service.dtos.request;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ChecksumEventRequest {
    private String orderUUID;
    private String externalRequest;
    private int amount;
    private String payOnlineType;
    private String paymentStatus;
    private int checksum;
}
