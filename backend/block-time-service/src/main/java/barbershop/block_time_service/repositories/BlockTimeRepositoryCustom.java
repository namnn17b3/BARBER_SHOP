package barbershop.block_time_service.repositories;

import barbershop.block_time_service.dtos.request.GetAllBlockTimesRequest;
import barbershop.block_time_service.entities.BlockTime;

import java.util.List;

public interface BlockTimeRepositoryCustom {
    List<BlockTime> getAllBlockTime(GetAllBlockTimesRequest getAllBlockTimesRequest);
    int countAllBlockTime(GetAllBlockTimesRequest getAllBlockTimesRequest);
}
