package barbershop.order_service.dtos.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaginationResponse extends BaseResponse {
    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Meta {
        private int page;
        private int items;
        private int totalRecords;
    }

    Meta meta;
}
