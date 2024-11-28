package barbershop.block_time_service.repositories;

import barbershop.block_time_service.entities.BlockTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlockTimeRepository extends JpaRepository<BlockTime, Integer>, BlockTimeRepositoryCustom {
    @Query("select bt from BlockTime bt where bt.date = ?1 and bt.time = ?2")
    Optional<BlockTime> findByDateAndTime(String date, String time);
}
