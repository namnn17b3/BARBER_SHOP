package barbershop.hair_color_service.dtos.request;

import lombok.*;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotBlank;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SaveHairColorRequest {
    @NotBlank
    @Length(min = 1, max = 10)
    private String color;

    @NotBlank
    @Length(min = 1, max = 10)
    private String colorCode;
}
