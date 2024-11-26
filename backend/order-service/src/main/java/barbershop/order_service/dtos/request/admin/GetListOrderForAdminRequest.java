package barbershop.order_service.dtos.request.admin;

import barbershop.order_service.dtos.request.PaginationRequest;
import lombok.*;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GetListOrderForAdminRequest extends PaginationRequest {
    private String sortBy;
    private String keyword;
    private String range;
    private Map<String, Object> user;
}
