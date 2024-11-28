package barbershop.block_time_service.dtos.request;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GetAllBlockTimesRequest extends PaginationRequest {
    private String range;
    private String sortBy;
    private Map<String, Object> user;
}
