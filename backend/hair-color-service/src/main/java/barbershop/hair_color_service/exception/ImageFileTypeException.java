package barbershop.hair_color_service.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ImageFileTypeException extends RuntimeException {
    private String message;
    private String field;
    private String resource;
}
