package barbershop.hair_color_service.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;
import javax.persistence.*;
import java.util.Date;

@Getter
@Setter
@MappedSuperclass
@DynamicInsert
@DynamicUpdate
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "created_at", updatable = false, nullable = false)
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @JsonIgnore
    private Date createdAt;

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @JsonIgnore
    private Date updatedAt;
}

