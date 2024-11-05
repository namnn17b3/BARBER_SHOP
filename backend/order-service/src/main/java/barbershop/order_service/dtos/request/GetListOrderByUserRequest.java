package barbershop.order_service.dtos.request;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GetListOrderByUserRequest extends PaginationRequest {
    private String sortBy;
    private String codeOrHairStyle;
    private Map<String, Object> user;
}
