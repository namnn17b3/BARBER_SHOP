package barbershop.user_service.entities;


import barbershop.user_service.enums.Gender;
import barbershop.user_service.enums.Role;
import lombok.*;
import javax.persistence.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User extends BaseEntity {
    @Column(name="username", nullable=false)
    private String username;

    @Column(name="password", nullable=false)
    private String password;

    @Column(name="email", unique=true, nullable=false)
    private String email;

    @Column(name="phone", nullable=false)
    private String phone;

    @Column(name="address", nullable=false)
    private String address;

    @Column(name="avatar", length=500)
    private String avatar;

    @Column(name="role", nullable=false)
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Column(name="gender", nullable=false)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name="active", nullable = false)
    private boolean active;
}