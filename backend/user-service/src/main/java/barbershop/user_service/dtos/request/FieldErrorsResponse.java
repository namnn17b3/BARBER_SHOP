package barbershop.user_service.dtos.request;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FieldErrorsResponse extends Exception {
    @Builder
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FieldError {
        private String field;
        private String message;
        private String resource;
    }

    private List<FieldError> errors;
}
