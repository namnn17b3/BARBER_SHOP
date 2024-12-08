package barbershop.hair_color_service.dtos.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SaveColorImageRequest {
    @NotNull
    @Min(1)
    private int hairColorId;

    private MultipartFile image;
}
