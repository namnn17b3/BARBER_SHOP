package barbershop.hair_color_service.repositories;

import barbershop.hair_color_service.entities.HairColor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Repository
public interface HairColorRepository extends JpaRepository<HairColor, Integer> {
    @Modifying
    @Transactional
    @Query(value = "truncate table hair_color", nativeQuery = true)
    void truncate();

    @Query("select hairColor from HairColor hairColor " +
            "where hairColor.color = :color and hairColor.colorCode = :colorCode")
    Optional<HairColor> findByColorAndColorCode(@Param("color") String color, @Param("colorCode") String colorCode);
}
