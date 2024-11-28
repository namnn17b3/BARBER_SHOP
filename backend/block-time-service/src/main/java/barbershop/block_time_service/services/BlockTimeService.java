package barbershop.block_time_service.services;

import barbershop.block_time_service.dtos.request.SaveBlockTimeRequest;
import barbershop.block_time_service.dtos.request.GetAllBlockTimesRequest;
import barbershop.block_time_service.dtos.response.BaseResponse;
import barbershop.block_time_service.dtos.response.PaginationResponse;

public interface BlockTimeService {
    PaginationResponse getAllBlockTimes(GetAllBlockTimesRequest getAllBlockTimesRequest) throws Exception;
    BaseResponse createNewBlockTime(SaveBlockTimeRequest saveBlockTimeRequest) throws Exception;
    BaseResponse updateBlockTime(String id, SaveBlockTimeRequest saveBlockTimeRequest) throws Exception;
    BaseResponse deleteBlockTime(String id) throws Exception;
    BaseResponse getBlockTimeById(String id) throws Exception;
}
