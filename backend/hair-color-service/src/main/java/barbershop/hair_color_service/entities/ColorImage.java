package barbershop.hair_color_service.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "color_image")
@ToString
public class ColorImage extends BaseEntity {
    @Column(name="url", nullable = false)
    private String url;

    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name="hair_color_id")
    @JsonBackReference
    private HairColor hairColor;
}
