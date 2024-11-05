package barbershop.block_time_service.entities;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "block_times")
public class BlockTime extends BaseEntity {
    @Column(name="date", length=255, nullable=false)
    private String date;

    @Column(name="time", length=255, nullable=false)
    private String time;
}
