package barbershop.order_service.dtos.response;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HttpExceptionResponse {
    private int status;
    private String message;
}
