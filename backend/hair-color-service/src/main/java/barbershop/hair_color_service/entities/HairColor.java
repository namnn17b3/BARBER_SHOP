package barbershop.hair_color_service.entities;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "hair_color")
public class HairColor extends BaseEntity {
    @Column(name="color", nullable = false, length = 50)
    private String color;

    @Column(name="price", nullable = false)
    private int price;

    @Column(name="active", nullable = false)
    private boolean active = true;

    @Column(name="color_code", nullable = false)
    private String colorCode;

    @OneToMany(cascade=CascadeType.ALL, fetch= FetchType.LAZY, mappedBy = "hairColor")
    @JsonManagedReference
    List<ColorImage> colorImages = new ArrayList<>();
}
