package barbershop.hair_color_service.repositories;

import barbershop.hair_color_service.entities.ColorImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ColorImageRepository extends JpaRepository<ColorImage, Integer>, ColorImageRepositoryCustom {
    @Modifying
    @Transactional
    @Query(value = "TRUNCATE TABLE color_image", nativeQuery = true)
    void truncate();
}
