package barbershop.hair_color_service.exception;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HttpException extends Exception {
    private String message;
    private int status;
}
