package barbershop.order_service.entities;

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
@Table(name = "orders")
public class Order extends BaseEntity {
    @Column(name="hair_style", nullable = false)
    private String hairStyle;

    @Column(name="hair_color")
    private String hairColor;

    @Column(name="barber", nullable = false)
    private String barber;

    @Column(name="user_id", nullable = false)
    private int userId;

    @Column(name="order_time", nullable = false)
    private Date orderTime;

    @Column(name="cutted", nullable = false)
    private boolean cutted;

    @Column(name="schedule", nullable = false)
    private Date schedule;
}
