package barbershop.block_time_service.services.impl;

import barbershop.block_time_service.Utils.Utils;
import barbershop.block_time_service.dtos.request.SaveBlockTimeRequest;
import barbershop.block_time_service.dtos.request.GetAllBlockTimesRequest;
import barbershop.block_time_service.dtos.response.BaseResponse;
import barbershop.block_time_service.dtos.response.FieldErrorsResponse;
import barbershop.block_time_service.dtos.response.PaginationResponse;
import barbershop.block_time_service.entities.BlockTime;
import barbershop.block_time_service.enums.TimeZone;
import barbershop.block_time_service.exception.ResourceNotFoundException;
import barbershop.block_time_service.repositories.BlockTimeRepository;
import barbershop.block_time_service.services.BlockTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class BlockTimeServiceImpl implements BlockTimeService {
    @Autowired
    private BlockTimeRepository blockTimeRepository;

    @Override
    public PaginationResponse getAllBlockTimes(GetAllBlockTimesRequest getAllBlockTimesRequest) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();

        if (getAllBlockTimesRequest.getSortBy() != null) {
            String regex = "^(asc|desc)$";
            Pattern pattern = Pattern.compile(regex);
            Matcher matcher = pattern.matcher(getAllBlockTimesRequest.getSortBy());
            if (!matcher.matches()) {
                listFieldErrors.add(
                        FieldErrorsResponse.FieldError.builder()
                                .field("sort by")
                                .message("Sort by must be most recent or longest")
                                .resource("GetAllBlockTimesRequest")
                                .build()
                );
                throw FieldErrorsResponse
                        .builder()
                        .errors(listFieldErrors)
                        .build();
            }
        }

        if (getAllBlockTimesRequest.getRange() == null || getAllBlockTimesRequest.getRange().isEmpty()) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("range")
                            .message("Range is not empty")
                            .resource("GetAllBlockTimesRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        if (getAllBlockTimesRequest.getRange().split(",").length != 2) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("range")
                            .message("Invalid range format")
                            .resource("GetAllBlockTimesRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }
        Date startDate = Utils.parseDate(getAllBlockTimesRequest.getRange().split(",")[0].trim()+" 00:00:00", "yyyy-MM-dd HH:mm:ss", TimeZone.ASIA_HCM.value());
        Date endDate = Utils.parseDate(getAllBlockTimesRequest.getRange().split(",")[1].trim()+" 00:00:00", "yyyy-MM-dd HH:mm:ss", TimeZone.ASIA_HCM.value());
        if (startDate == null) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("start date")
                            .message("Invalid range: invalid start date")
                            .resource("GetAllBlockTimesRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }
        if (endDate == null) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("end date")
                            .message("Invalid range: invalid end date")
                            .resource("GetAllBlockTimesRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        if (startDate.getTime() > endDate.getTime()) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("start date")
                            .message("Invalid range: start date must be less than or equals end date")
                            .resource("GetAllBlockTimesRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        if (endDate.getTime() - startDate.getTime() > 6 * 24 * 60 * 60 * 1000) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("start date")
                            .message("Invalid range: range in [0;7] days")
                            .resource("GetAllBlockTimesRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        List<BlockTime> blockTimes = blockTimeRepository.getAllBlockTime(getAllBlockTimesRequest);
        List<Map<String, Object>> listBlockTimeMap = new ArrayList<>();
        for (BlockTime blockTime : blockTimes) {
            Map<String, Object> mapBlockTime = new LinkedHashMap<>();
            mapBlockTime.put("id", blockTime.getId());
            mapBlockTime.put("date", blockTime.getDate());
            mapBlockTime.put("time", blockTime.getTime());
            listBlockTimeMap.add(mapBlockTime);
        }

        int totalRecords = blockTimeRepository.countAllBlockTime(getAllBlockTimesRequest);
        PaginationResponse paginationResponse = PaginationResponse.builder()
                .meta(PaginationResponse.Meta.builder()
                        .totalRecords(totalRecords)
                        .items(Integer.parseInt(getAllBlockTimesRequest.getItems()))
                        .page(Integer.parseInt(getAllBlockTimesRequest.getPage()))
                        .build())
                .build();
        paginationResponse.setData(listBlockTimeMap);

        return paginationResponse;
    }

    @Override
    @Transactional
    public BaseResponse createNewBlockTime(SaveBlockTimeRequest saveBlockTimeRequest) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();

        Date correctDate = Utils.parseDate(saveBlockTimeRequest.getDate()+" "+ saveBlockTimeRequest.getTime(), "yyyy-MM-dd HH:mm", TimeZone.ASIA_HCM.value());
        if (correctDate == null) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("date; time")
                            .message("Invalid date and time")
                            .resource("SaveBlockTimeRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        BlockTime blockTime = blockTimeRepository.findByDateAndTime(
                saveBlockTimeRequest.getDate(), saveBlockTimeRequest.getTime()
        ).orElse(null);
        if (blockTime != null) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("date; time")
                            .message("Date and time is existed")
                            .resource("SaveBlockTimeRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        blockTime = BlockTime.builder()
                .date(saveBlockTimeRequest.getDate())
                .time(saveBlockTimeRequest.getTime())
                .build();

        blockTime = blockTimeRepository.save(blockTime);

        return new BaseResponse(Map.of(
                "id", blockTime.getId(),
                "date", blockTime.getDate(),
                "time", blockTime.getTime()
        ));
    }

    @Override
    @Transactional
    public BaseResponse updateBlockTime(String blockTimeId, SaveBlockTimeRequest saveBlockTimeRequest) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();

        int id = 0;
        try {
            id = Integer.parseInt(blockTimeId);
        } catch (Exception exception) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("id")
                            .message("Id is invalid integer format")
                            .resource("SaveBlockTimeRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        Date correctDate = Utils.parseDate(saveBlockTimeRequest.getDate()+" "+ saveBlockTimeRequest.getTime(), "yyyy-MM-dd HH:mm", TimeZone.ASIA_HCM.value());
        if (correctDate == null) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("date; time")
                            .message("Invalid date and time")
                            .resource("SaveBlockTimeRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        BlockTime blockTime = blockTimeRepository.findById(id).orElse(null);
        if (blockTime == null) {
            throw new ResourceNotFoundException("BlockTime with id " + id + " not found");
        }


        blockTime = blockTimeRepository.findByDateAndTime(
                saveBlockTimeRequest.getDate(), saveBlockTimeRequest.getTime()
        ).orElse(null);
        if (blockTime != null && blockTime.getId() != id) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("date; time")
                            .message("Date and time is existed")
                            .resource("SaveBlockTimeRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        blockTime = BlockTime.builder()
                .date(saveBlockTimeRequest.getDate())
                .time(saveBlockTimeRequest.getTime())
                .build();
        blockTime.setId(id);

        blockTimeRepository.save(blockTime);
        return new BaseResponse(Map.of(
                "id", id,
                "date", blockTime.getDate(),
                "time", blockTime.getTime()
        ));
    }

    @Override
    @Transactional
    public BaseResponse deleteBlockTime(String blockTimeId) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();

        int id = 0;
        try {
            id = Integer.parseInt(blockTimeId);
        } catch (Exception exception) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("id")
                            .message("Id is invalid integer format")
                            .resource("SaveBlockTimeRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        BlockTime blockTime = blockTimeRepository.findById(id).orElse(null);
        if (blockTime == null) {
            throw new ResourceNotFoundException("BlockTime with id " + id + " not found");
        }

        blockTimeRepository.deleteById(id);

        return new BaseResponse(Map.of("message", "Deleted block time: \"" + blockTime.getDate() + " " + blockTime.getTime() + "\" successfully"));
    }

    @Override
    public BaseResponse getBlockTimeById(String blockTimeId) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();

        int id = 0;
        try {
            id = Integer.parseInt(blockTimeId);
        } catch (Exception exception) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("id")
                            .message("Id is invalid integer format")
                            .resource("SaveBlockTimeRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        BlockTime blockTime = blockTimeRepository.findById(id).orElse(null);
        if (blockTime == null) {
            throw new ResourceNotFoundException("BlockTime with id " + id + " not found");
        }

        return new BaseResponse(Map.of(
                "id", id,
                "date", blockTime.getDate(),
                "time", blockTime.getTime()
        ));
    }
}
