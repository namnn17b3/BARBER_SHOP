package barbershop.user_service.repositories;

import barbershop.user_service.entities.User;
import barbershop.user_service.enums.Gender;
import barbershop.user_service.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>, UserRepositoryCustom {
    Optional<User> findByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET " +
            "u.username = :username," +
            "u.phone = :phone," +
            "u.address = :address," +
            "u.gender = :gender," +
            "u.avatar = :avatar " +
            "WHERE u.id = :id")
    void updateUserProfile(
            @Param("username") String username,
            @Param("phone") String phone,
            @Param("address") String address,
            @Param("gender") Gender gender,
            @Param("avatar") String avatar,
            @Param("id") int id);

    @Modifying
    @Query("UPDATE User u SET " +
            "u.password = :newPassword "+
            "WHERE u.id = :id")
    void changePasswordById(
            @Param("newPassword") String newPassword,
            @Param("id") int id);

    @Modifying
    @Query("UPDATE User u SET " +
            "u.password = :newPassword "+
            "WHERE u.email = :email")
    void changePasswordByEmail(
            @Param("newPassword") String newPassword,
            @Param("email") String email);

    @Query("select u from User u where u.id = :id and u.role = :role")
    Optional<User> findByIdAndRole(@Param("id") int id, @Param("role") Role role);
}
